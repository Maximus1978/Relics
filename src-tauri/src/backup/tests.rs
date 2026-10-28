use super::{
    model::{self, Activity, Backup, Data, Habit},
    storage,
};
use sqlx::{
    migrate::{Migration, MigrationType, Migrator},
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions},
    Row, SqlitePool,
};
use std::{
    borrow::Cow,
    path::{Path, PathBuf},
    process::Command,
    time::Duration,
};
use tempfile::TempDir;

fn example() -> Backup {
    Backup::new(Data {
        habits: vec![
            Habit {
                id: "guitar".into(),
                name: "Гитара 'вечером'".into(),
                spheres: vec!["mind".into(), "recovery".into()],
                archived_at: None,
            },
            Habit {
                id: "read".into(),
                name: "Книги".into(),
                spheres: vec!["mind".into()],
                archived_at: Some("2026-10-27T22:10:00.123Z".into()),
            },
        ],
        activities: vec![
            Activity {
                id: "entry-26".into(),
                habit_id: "guitar".into(),
                habit_name: "Guitar before rename".into(),
                spheres: vec!["mind".into()],
                occurred_on: "2026-10-26".into(),
                recorded_at: "2026-10-27T01:02:03.004Z".into(),
                timezone: "America/Los_Angeles".into(),
            },
            Activity {
                id: "entry-27".into(),
                habit_id: "read".into(),
                habit_name: "Чтение раньше".into(),
                spheres: vec!["mind".into(), "recovery".into()],
                occurred_on: "2026-10-27".into(),
                recorded_at: "2026-10-27T15:40:00+03:00".into(),
                timezone: "Europe/Moscow".into(),
            },
        ],
    })
}

async fn connect(path: &Path) -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(4)
        .connect_with(
            SqliteConnectOptions::new()
                .filename(path)
                .create_if_missing(true)
                .foreign_keys(true)
                .journal_mode(SqliteJournalMode::Wal)
                .busy_timeout(Duration::from_secs(3)),
        )
        .await
        .unwrap()
}

async fn migrate(pool: &SqlitePool, version: usize) {
    let definitions = [
        (
            "initial activity journal",
            include_str!("../../migrations/001_initial.sql"),
        ),
        (
            "archive habits without removing history",
            include_str!("../../migrations/002_archive_habits.sql"),
        ),
        (
            "seed sample habits once before backup restoration",
            include_str!("../../migrations/003_seed_once.sql"),
        ),
    ];
    let migrations = definitions
        .iter()
        .take(version)
        .enumerate()
        .map(|(index, (description, sql))| {
            Migration::new(
                (index + 1) as i64,
                (*description).into(),
                MigrationType::ReversibleUp,
                (*sql).into(),
                false,
            )
        })
        .collect::<Vec<_>>();
    Migrator {
        migrations: Cow::Owned(migrations),
        ..Migrator::DEFAULT
    }
    .run(pool)
    .await
    .unwrap();
}

async fn fixture() -> (TempDir, PathBuf, SqlitePool) {
    let temporary = tempfile::tempdir().unwrap();
    let path = temporary.path().join("synthetic.db");
    let pool = connect(&path).await;
    migrate(&pool, 3).await;
    (temporary, path, pool)
}

#[test]
fn json_round_trip_preserves_every_field_without_derived_data() {
    let backup = example();
    let bytes = model::encode(&backup).unwrap();
    assert_eq!(model::parse(&bytes).unwrap(), backup);
    let text = String::from_utf8(bytes).unwrap();
    assert!(text.contains("\n  \"format\""));
    assert!(!text.contains("Mastery"));
}

#[test]
fn rejects_malformed_unknown_versions_fields_and_missing_archive_property() {
    assert!(model::parse(b"not json").is_err());
    for (key, value) in [
        ("format", serde_json::json!("other")),
        ("formatVersion", serde_json::json!(2)),
        ("databaseSchemaVersion", serde_json::json!(2)),
        ("exportedAt", serde_json::json!("2026-99-99")),
        ("appVersion", serde_json::json!(null)),
        ("extra", serde_json::json!(true)),
    ] {
        let mut invalid = serde_json::to_value(example()).unwrap();
        invalid[key] = value;
        assert!(
            model::parse(&serde_json::to_vec(&invalid).unwrap()).is_err(),
            "{key}"
        );
    }
    let mut invalid = serde_json::to_value(example()).unwrap();
    invalid["data"]["habits"][0]
        .as_object_mut()
        .unwrap()
        .remove("archivedAt");
    assert!(model::parse(&serde_json::to_vec(&invalid).unwrap()).is_err());
}

#[test]
fn rejects_invalid_references_duplicate_ids_and_duplicate_habit_day() {
    let mut backup = example();
    backup.data.activities[0].habit_id = "missing".into();
    assert!(backup.validate().is_err());
    backup = example();
    backup.data.habits.push(backup.data.habits[0].clone());
    assert!(backup.validate().is_err());
    backup = example();
    backup
        .data
        .activities
        .push(backup.data.activities[0].clone());
    assert!(backup.validate().is_err());
    backup.data.activities.last_mut().unwrap().id = "different-id".into();
    assert!(backup.validate().is_err());
}

#[test]
fn rejects_bad_names_spheres_dates_timestamps_timezones_and_archive_state() {
    let original = serde_json::to_value(example()).unwrap();
    for (pointer, value) in [
        ("/data/habits/0/name", serde_json::json!("  ")),
        ("/data/habits/0/spheres", serde_json::json!([])),
        ("/data/habits/0/spheres", serde_json::json!(["unknown"])),
        (
            "/data/activities/0/spheres",
            serde_json::json!(["mind", "mind"]),
        ),
        ("/data/activities/0/habitName", serde_json::json!("")),
        (
            "/data/activities/0/occurredOn",
            serde_json::json!("2026-02-29"),
        ),
        (
            "/data/activities/0/recordedAt",
            serde_json::json!("not-a-timestamp"),
        ),
        (
            "/data/activities/0/timezone",
            serde_json::json!("Local/Nowhere"),
        ),
        ("/data/habits/0/archivedAt", serde_json::json!(true)),
        ("/data/habits/0/archivedAt", serde_json::json!("bad-time")),
    ] {
        let mut invalid = original.clone();
        *invalid.pointer_mut(pointer).unwrap() = value;
        assert!(
            model::parse(&serde_json::to_vec(&invalid).unwrap()).is_err(),
            "{pointer}"
        );
    }
}

#[test]
fn enforces_file_and_record_limits_without_truncation() {
    assert!(model::parse(&vec![b' '; model::MAX_BYTES + 1]).is_err());
    let mut backup = example();
    backup.data.habits = vec![backup.data.habits[0].clone(); model::MAX_HABITS + 1];
    assert!(backup.validate().is_err());
    backup = example();
    backup.data.activities = vec![backup.data.activities[0].clone(); model::MAX_ACTIVITIES + 1];
    assert!(backup.validate().is_err());
}

#[tokio::test]
async fn full_export_restore_reopen_preserves_metadata_snapshots_and_archive() {
    let (temporary, path, pool) = fixture().await;
    let backup = example();
    let safety = storage::restore(&pool, &backup, &temporary.path().join("recovery"))
        .await
        .unwrap();
    assert_eq!(storage::read_backup(&safety).unwrap().data.habits.len(), 3);
    let exported = storage::export(&pool).await.unwrap();
    assert_eq!(exported.data, backup.data);
    let external = temporary.path().join("export.json");
    storage::write_backup(&external, &exported).unwrap();
    let checked = storage::read_backup(&external).unwrap();
    pool.close().await;
    let reopened = connect(&path).await;
    migrate(&reopened, 3).await;
    assert_eq!(storage::export(&reopened).await.unwrap().data, backup.data);
    let other = connect(&temporary.path().join("fresh.db")).await;
    migrate(&other, 3).await;
    storage::restore(&other, &checked, &temporary.path().join("fresh-recovery"))
        .await
        .unwrap();
    assert_eq!(storage::export(&other).await.unwrap().data, backup.data);
    other.close().await;
    reopened.close().await;
}

#[tokio::test]
async fn empty_restored_database_stays_empty_after_migrations_and_reopen() {
    let (temporary, path, pool) = fixture().await;
    let backup = Backup::new(Data {
        habits: vec![],
        activities: vec![],
    });
    storage::restore(&pool, &backup, &temporary.path().join("recovery"))
        .await
        .unwrap();
    pool.close().await;
    let reopened = connect(&path).await;
    migrate(&reopened, 3).await;
    assert_eq!(storage::export(&reopened).await.unwrap().data, backup.data);
    reopened.close().await;
}

#[tokio::test]
async fn snapshot_stays_consistent_across_concurrent_commit() {
    let (temporary, _, pool) = fixture().await;
    storage::restore(&pool, &example(), &temporary.path().join("recovery"))
        .await
        .unwrap();
    let before = storage::export(&pool).await.unwrap().data;
    let mut reader = pool.begin().await.unwrap();
    sqlx::query("SELECT id FROM habits")
        .fetch_all(&mut *reader)
        .await
        .unwrap();
    let mut writer = pool.begin().await.unwrap();
    sqlx::query("UPDATE habits SET name = 'Changed atomically'")
        .execute(&mut *writer)
        .await
        .unwrap();
    sqlx::query("UPDATE activities SET habit_name_snapshot = 'Changed atomically'")
        .execute(&mut *writer)
        .await
        .unwrap();
    writer.commit().await.unwrap();
    assert_eq!(storage::snapshot(&mut reader).await.unwrap().data, before);
    reader.commit().await.unwrap();
    let after = storage::export(&pool).await.unwrap();
    assert!(after
        .data
        .habits
        .iter()
        .all(|habit| habit.name == "Changed atomically"));
    assert!(after
        .data
        .activities
        .iter()
        .all(|activity| activity.habit_name == "Changed atomically"));
    pool.close().await;
}

#[tokio::test]
async fn rollback_after_delete_and_mid_insert_keeps_original_database() {
    let (temporary, _, pool) = fixture().await;
    storage::restore(&pool, &example(), &temporary.path().join("setup-recovery"))
        .await
        .unwrap();
    let before = storage::export(&pool).await.unwrap().data;
    let safety = temporary.path().join("safety.json");
    let failed = storage::replace(
        &pool,
        &example(),
        |current| {
            storage::write_backup(&safety, current)?;
            Ok(safety.clone())
        },
        || Err("injected interruption after delete".into()),
    )
    .await;
    assert_eq!(failed.unwrap_err(), "injected interruption after delete");
    assert_eq!(storage::export(&pool).await.unwrap().data, before);
    assert_eq!(storage::read_backup(&safety).unwrap().data, before);
    sqlx::query("CREATE TRIGGER synthetic_fail BEFORE INSERT ON habits WHEN NEW.id = 'read' BEGIN SELECT RAISE(ABORT, 'synthetic failure'); END")
        .execute(&pool).await.unwrap();
    assert!(
        storage::restore(&pool, &example(), &temporary.path().join("recovery"))
            .await
            .is_err()
    );
    assert_eq!(storage::export(&pool).await.unwrap().data, before);
    pool.close().await;
}

#[tokio::test]
async fn failed_safety_snapshot_and_invalid_import_never_start_replacement() {
    let (temporary, _, pool) = fixture().await;
    storage::restore(&pool, &example(), &temporary.path().join("setup-recovery"))
        .await
        .unwrap();
    let before = storage::export(&pool).await.unwrap().data;
    assert!(storage::replace(
        &pool,
        &example(),
        |_| Err("synthetic disk failure".into()),
        || panic!("must not delete")
    )
    .await
    .is_err());
    assert_eq!(storage::export(&pool).await.unwrap().data, before);
    let file_instead_of_directory = temporary.path().join("not-a-directory");
    std::fs::write(&file_instead_of_directory, b"existing").unwrap();
    assert!(
        storage::restore(&pool, &example(), &file_instead_of_directory.join("child"))
            .await
            .is_err()
    );
    let mut invalid = example();
    invalid.data.activities[0].habit_id = "missing".into();
    assert!(storage::replace(
        &pool,
        &invalid,
        |_| panic!("must validate first"),
        || panic!("must not delete")
    )
    .await
    .is_err());
    assert_eq!(storage::export(&pool).await.unwrap().data, before);
    pool.close().await;
}

#[tokio::test]
async fn preview_read_and_cancel_make_no_database_changes() {
    let (temporary, _, pool) = fixture().await;
    storage::restore(&pool, &example(), &temporary.path().join("setup-recovery"))
        .await
        .unwrap();
    let before = storage::export(&pool).await.unwrap().data;
    let path = temporary.path().join("selection.json");
    storage::write_backup(&path, &example()).unwrap();
    let state = super::BackupState::default();
    *state.pending.lock().await = Some(super::Pending {
        token: "preview-only".into(),
        backup: storage::read_backup(&path).unwrap(),
    });
    state.clear_pending().await;
    assert!(state.pending.lock().await.is_none());
    assert!(state.take_pending("preview-only").await.is_err());
    assert_eq!(storage::export(&pool).await.unwrap().data, before);
    pool.close().await;
}

#[tokio::test]
async fn preview_token_is_bound_to_cached_bytes_and_can_be_used_once() {
    let state = super::BackupState::default();
    let backup = example();
    *state.pending.lock().await = Some(super::Pending {
        token: "checked-token".into(),
        backup: backup.clone(),
    });
    assert_eq!(state.take_pending("checked-token").await.unwrap(), backup);
    assert!(state.take_pending("checked-token").await.is_err());
    *state.pending.lock().await = Some(super::Pending {
        token: "new-token".into(),
        backup,
    });
    assert!(state.take_pending("old-token").await.is_err());
}

#[test]
fn atomic_file_publication_keeps_old_file_on_failure_and_replaces_on_success() {
    let temporary = tempfile::tempdir().unwrap();
    let existing = temporary.path().join("existing.json");
    storage::write_backup(&existing, &example()).unwrap();
    let original = std::fs::read(&existing).unwrap();
    let mut invalid = example();
    invalid.format_version = 99;
    assert!(storage::write_backup(&existing, &invalid).is_err());
    assert_eq!(std::fs::read(&existing).unwrap(), original);
    assert!(storage::atomic_write(temporary.path(), b"cannot replace a directory").is_err());
    assert_eq!(std::fs::read(&existing).unwrap(), original);
    storage::atomic_write(&existing, b"complete replacement").unwrap();
    assert_eq!(std::fs::read(&existing).unwrap(), b"complete replacement");
}

#[test]
fn retained_safety_snapshot_is_verified_and_cannot_be_overwritten() {
    let temporary = tempfile::tempdir().unwrap();
    let path = temporary.path().join("safety.json");
    let original = example();
    storage::write_safety(&path, &original).unwrap();
    assert_eq!(storage::read_backup(&path).unwrap(), original);
    let mut changed = original.clone();
    changed.data.habits[0].name = "Changed".into();
    assert!(storage::write_safety(&path, &changed).is_err());
    assert_eq!(storage::read_backup(&path).unwrap(), original);
}

#[tokio::test]
async fn migration_from_v1_and_archived_v2_preserves_history_and_does_not_reseed() {
    let temporary = tempfile::tempdir().unwrap();
    let pool = connect(&temporary.path().join("old.db")).await;
    migrate(&pool, 1).await;
    sqlx::query(
        "INSERT INTO habits (id,name,spheres_json) VALUES ('walk','Original','[\"mind\"]')",
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query("INSERT INTO activities VALUES ('legacy','walk','October snapshot','[\"body\"]','2026-10-26','2026-10-27T00:00:00Z','UTC')").execute(&pool).await.unwrap();
    migrate(&pool, 2).await;
    sqlx::query("UPDATE habits SET archived_at = '2026-10-27T01:00:00Z'")
        .execute(&pool)
        .await
        .unwrap();
    let before = storage::export(&pool).await.unwrap().data;
    migrate(&pool, 3).await;
    let migrated = storage::export(&pool).await.unwrap();
    assert_eq!(migrated.data.activities, before.activities);
    assert_eq!(migrated.data.habits[0], before.habits[0]);
    sqlx::query("DELETE FROM activities")
        .execute(&pool)
        .await
        .unwrap();
    sqlx::query("DELETE FROM habits WHERE id = 'read'")
        .execute(&pool)
        .await
        .unwrap();
    migrate(&pool, 3).await;
    assert_eq!(
        sqlx::query("SELECT COUNT(*) AS total FROM habits WHERE id = 'read'")
            .fetch_one(&pool)
            .await
            .unwrap()
            .get::<i64, _>("total"),
        0
    );
    pool.close().await;
}

#[tokio::test]
async fn dropping_process_mid_transaction_recovers_original_data() {
    let (temporary, path, pool) = fixture().await;
    storage::restore(&pool, &example(), &temporary.path().join("setup-recovery"))
        .await
        .unwrap();
    let before = storage::export(&pool).await.unwrap().data;
    pool.close().await;
    let status = Command::new(std::env::current_exe().unwrap())
        .args(["--exact", "backup::tests::crash_helper", "--ignored"])
        .env("RELICS_SYNTHETIC_CRASH_DB", &path)
        .status()
        .unwrap();
    assert_eq!(status.code(), Some(73));
    let reopened = connect(&path).await;
    assert_eq!(storage::export(&reopened).await.unwrap().data, before);
    let recovery = storage::read_backup(&temporary.path().join("crash-safety.json")).unwrap();
    assert_eq!(recovery.data, before);
    reopened.close().await;
}

#[test]
#[ignore]
fn crash_helper() {
    let path = PathBuf::from(
        std::env::var_os("RELICS_SYNTHETIC_CRASH_DB").expect("synthetic crash helper only"),
    );
    assert!(path.file_name().unwrap() == "synthetic.db");
    let runtime = tokio::runtime::Runtime::new().unwrap();
    runtime.block_on(async {
        let pool = connect(&path).await;
        let safety = path.parent().unwrap().join("crash-safety.json");
        let _ = storage::replace(
            &pool,
            &example(),
            |current| {
                storage::write_backup(&safety, current)?;
                Ok(safety)
            },
            || std::process::exit(73),
        )
        .await;
        panic!("crash injection was not reached");
    });
}
