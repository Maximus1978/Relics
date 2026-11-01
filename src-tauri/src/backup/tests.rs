use super::{
    model::{self, Activity, Backup, Data, Habit},
    storage,
};
use crate::contributions::{Origin, Profile};
use crate::rhythm::{
    ArchivePause, Frequency, FrequencySegment, HabitMutation, MutationKind, RhythmChange,
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
                contribution_profile: {
                    let mut p = Profile::defaults(&vec!["mind".into(), "recovery".into()]);
                    p.origin = Origin::User;
                    p.values.mind = 7;
                    p.values.recovery = 3;
                    p
                },
            },
            Habit {
                id: "read".into(),
                name: "Книги".into(),
                spheres: vec!["mind".into()],
                archived_at: Some("2026-10-27T22:10:00.123Z".into()),
                contribution_profile: Profile::defaults(&vec!["mind".into()]),
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
                contribution_snapshot: Some({
                    let mut p = Profile::defaults(&vec!["mind".into()]);
                    p.origin = Origin::User;
                    p.values.mind = 7;
                    p
                }),
            },
            Activity {
                id: "entry-27".into(),
                habit_id: "read".into(),
                habit_name: "Чтение раньше".into(),
                spheres: vec!["mind".into(), "recovery".into()],
                occurred_on: "2026-10-27".into(),
                recorded_at: "2026-10-27T15:40:00+03:00".into(),
                timezone: "Europe/Moscow".into(),
                contribution_snapshot: None,
            },
        ],
        frequency_segments: vec![
            FrequencySegment {
                id: "rhythm-guitar-initial".into(),
                habit_id: "guitar".into(),
                frequency: Frequency::Daily,
                effective_on: "2026-10-26".into(),
                created_on: "2026-10-26".into(),
                version: 1,
            },
            FrequencySegment {
                id: "rhythm-guitar-pending".into(),
                habit_id: "guitar".into(),
                frequency: Frequency::Weekly,
                effective_on: "2026-11-02".into(),
                created_on: "2026-10-28".into(),
                version: 1,
            },
        ],
        archive_pauses: vec![ArchivePause {
            id: "legacy-read".into(),
            habit_id: "read".into(),
            start_on: None,
            end_exclusive_on: None,
            reason: "archive".into(),
            provenance: "legacy_unknown".into(),
        }],
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

fn make_migrator(version: usize) -> Migrator {
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
        (
            "subjective sphere contribution snapshots",
            include_str!("../../migrations/004_habit_contributions.sql"),
        ),
        (
            "habit frequency and archive history",
            include_str!("../../migrations/005_habit_rhythm.sql"),
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
}
async fn migrate(pool: &SqlitePool, version: usize) {
    make_migrator(version).run(pool).await.unwrap();
}

async fn fixture() -> (TempDir, PathBuf, SqlitePool) {
    let temporary = tempfile::tempdir().unwrap();
    let path = temporary.path().join("synthetic.db");
    let pool = connect(&path).await;
    migrate(&pool, 5).await;
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
        ("formatVersion", serde_json::json!(4)),
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
    migrate(&reopened, 5).await;
    assert_eq!(storage::export(&reopened).await.unwrap().data, backup.data);
    let other = connect(&temporary.path().join("fresh.db")).await;
    migrate(&other, 5).await;
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
        ..Data::default()
    });
    storage::restore(&pool, &backup, &temporary.path().join("recovery"))
        .await
        .unwrap();
    pool.close().await;
    let reopened = connect(&path).await;
    migrate(&reopened, 5).await;
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
    let before_name: String = sqlx::query_scalar("SELECT name FROM habits WHERE id='walk'")
        .fetch_one(&pool)
        .await
        .unwrap();
    migrate(&pool, 5).await;
    let migrated = storage::export(&pool).await.unwrap();
    assert_eq!(migrated.data.activities[0].habit_name, "October snapshot");
    assert_eq!(migrated.data.activities[0].contribution_snapshot, None);
    assert_eq!(migrated.data.habits[0].name, before_name);
    assert_eq!(
        migrated.data.habits[0].contribution_profile.origin,
        Origin::LegacyDefault
    );
    assert_eq!(
        migrated.data.habits[0].archived_at.as_deref(),
        Some("2026-10-27T01:00:00Z")
    );
    sqlx::query("DELETE FROM activities")
        .execute(&pool)
        .await
        .unwrap();
    sqlx::query("DELETE FROM habits WHERE id = 'read'")
        .execute(&pool)
        .await
        .unwrap();
    migrate(&pool, 5).await;
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

#[test]
fn contribution_conformance_matches_typescript_vectors() {
    #[derive(serde::Deserialize)]
    struct Case {
        name: String,
        json: String,
        spheres: Vec<String>,
        valid: bool,
    }
    let cases: Vec<Case> = serde_json::from_str(include_str!(
        "../../../tests/fixtures/contribution-profiles.json"
    ))
    .unwrap();
    for c in cases {
        let result = serde_json::from_str::<Profile>(&c.json)
            .map_err(|_| "parse".to_string())
            .and_then(|p| p.validate(&c.spheres));
        assert_eq!(result.is_ok(), c.valid, "{}", c.name);
    }
}

fn old_v1_bytes() -> Vec<u8> {
    let mut value = serde_json::to_value(example()).unwrap();
    value["formatVersion"] = serde_json::json!(1);
    value["databaseSchemaVersion"] = serde_json::json!(3);
    value["data"]
        .as_object_mut()
        .unwrap()
        .remove("frequencySegments");
    value["data"]
        .as_object_mut()
        .unwrap()
        .remove("archivePauses");
    for h in value["data"]["habits"].as_array_mut().unwrap() {
        h.as_object_mut().unwrap().remove("contributionProfile");
    }
    for a in value["data"]["activities"].as_array_mut().unwrap() {
        a.as_object_mut().unwrap().remove("contributionSnapshot");
    }
    serde_json::to_vec(&value).unwrap()
}
#[test]
fn strict_v1_adapter_and_v2_null_contract_do_not_drop_unknown_data() {
    let old = model::parse(&old_v1_bytes()).unwrap();
    assert_eq!(old.format_version, 1);
    assert!(old
        .data
        .activities
        .iter()
        .all(|a| a.contribution_snapshot.is_none()));
    assert!(old
        .data
        .habits
        .iter()
        .all(|h| h.contribution_profile.origin == Origin::LegacyDefault));
    assert!(
        model::encode(&old).is_err(),
        "never export weighted state as v1"
    );
    let original = serde_json::to_value(example()).unwrap();
    let mut missing = original.clone();
    missing["data"]["activities"][1]
        .as_object_mut()
        .unwrap()
        .remove("contributionSnapshot");
    assert!(model::parse(&serde_json::to_vec(&missing).unwrap()).is_err());
    let mut malformed = original.clone();
    malformed["data"]["habits"][0]["contributionProfile"]["values"]["mind"] = serde_json::json!(11);
    assert!(model::parse(&serde_json::to_vec(&malformed).unwrap()).is_err());
    let mut future = original.clone();
    future["data"]["habits"][0]["contributionProfile"]["version"] = serde_json::json!(2);
    assert!(model::parse(&serde_json::to_vec(&future).unwrap()).is_err());
    let mut mismatch = original.clone();
    mismatch["data"]["activities"][0]["contributionSnapshot"]["values"]["body"] =
        serde_json::json!(3);
    assert!(
        model::parse(&serde_json::to_vec(&mismatch).unwrap()).is_err(),
        "compare historical own spheres"
    );
    let mut old_extra: serde_json::Value = serde_json::from_slice(&old_v1_bytes()).unwrap();
    old_extra["data"]["habits"][0]["contributionProfile"] =
        original["data"]["habits"][0]["contributionProfile"].clone();
    assert!(model::parse(&serde_json::to_vec(&old_extra).unwrap()).is_err());
    let text = String::from_utf8(old_v1_bytes()).unwrap().replacen(
        "\"formatVersion\":1",
        "\"formatVersion\":1,\"formatVersion\":1",
        1,
    );
    assert!(model::parse(text.as_bytes()).is_err());
    let text = serde_json::to_string(&example()).unwrap().replacen(
        "\"mind\":7",
        "\"mind\":7,\"mind\":5",
        1,
    );
    assert!(model::parse(text.as_bytes()).is_err());
}

#[tokio::test]
async fn v1_full_replacement_can_be_undone_with_complete_v2_weighted_safety() {
    let (temporary, path, pool) = fixture().await;
    let mut weighted = example();
    let mut third = weighted.data.activities[0].clone();
    third.id = "default-event".into();
    third.habit_id = "read".into();
    third.spheres = vec!["mind".into()];
    third.occurred_on = "2026-10-25".into();
    third.contribution_snapshot = Some(Profile::defaults(&third.spheres));
    weighted.data.activities.push(third);
    storage::restore(&pool, &weighted, &temporary.path().join("setup"))
        .await
        .unwrap();
    let before = storage::export(&pool).await.unwrap().data;
    let old = model::parse(&old_v1_bytes()).unwrap();
    let safety = storage::restore(&pool, &old, &temporary.path().join("recovery"))
        .await
        .unwrap();
    let converted = storage::export(&pool).await.unwrap();
    assert_eq!(converted.format_version, 3);
    assert_eq!(converted.database_schema_version, 5);
    assert_eq!(converted.data, old.data);
    assert!(converted
        .data
        .activities
        .iter()
        .all(|a| a.contribution_snapshot.is_none()));
    let protective = storage::read_backup(&safety).unwrap();
    assert_eq!(protective.format_version, 3);
    assert_eq!(protective.data, before);
    storage::restore(&pool, &protective, &temporary.path().join("undo"))
        .await
        .unwrap();
    pool.close().await;
    let reopened = connect(&path).await;
    migrate(&reopened, 5).await;
    let after = storage::export(&reopened).await.unwrap();
    assert_eq!(after.data, before);
    assert_eq!(after.summary().user_entries, 1);
    assert_eq!(after.summary().default_entries, 1);
    assert_eq!(after.summary().legacy_entries, 1);
    reopened.close().await;
}

#[tokio::test]
async fn migration_four_failure_rolls_back_schema_data_and_actual_sqlx_ledger() {
    let temporary = tempfile::tempdir().unwrap();
    let path = temporary.path().join("synthetic.db");
    let pool = connect(&path).await;
    migrate(&pool, 3).await;
    sqlx::query("UPDATE habits SET spheres_json='[\"mind\",\"mind\"]' WHERE id='read'")
        .execute(&pool)
        .await
        .unwrap();
    assert!(make_migrator(4).run(&pool).await.is_err());
    let columns = sqlx::query("PRAGMA table_info(habits)")
        .fetch_all(&pool)
        .await
        .unwrap();
    assert!(!columns
        .iter()
        .any(|r| r.get::<String, _>("name") == "contribution_profile_json"));
    let version: i64 = sqlx::query_scalar("SELECT max(version) FROM _sqlx_migrations")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(version, 3);
    sqlx::query("UPDATE habits SET spheres_json='[\"mind\"]' WHERE id='read'")
        .execute(&pool)
        .await
        .unwrap();
    pool.close().await;
    let reopened = connect(&path).await;
    migrate(&reopened, 5).await;
    assert_eq!(
        storage::export(&reopened).await.unwrap().data.habits.len(),
        3
    );
    reopened.close().await;
}

#[tokio::test]
async fn schema_three_upgrade_keeps_october_records_and_archived_profiles() {
    let temporary = tempfile::tempdir().unwrap();
    let path = temporary.path().join("synthetic.db");
    let pool = connect(&path).await;
    migrate(&pool, 3).await;
    sqlx::query("UPDATE habits SET archived_at='2026-10-27T00:00:00Z' WHERE id='read'")
        .execute(&pool)
        .await
        .unwrap();
    for day in ["2026-10-26", "2026-10-27"] {
        sqlx::query("INSERT INTO activities VALUES (?,'read','Historical name','[\"mind\",\"recovery\"]',?,'2026-10-27T00:00:00Z','UTC')").bind(day).bind(day).execute(&pool).await.unwrap();
    }
    migrate(&pool, 5).await;
    migrate(&pool, 5).await;
    pool.close().await;
    let reopened = connect(&path).await;
    let saved = storage::export(&reopened).await.unwrap();
    assert_eq!(saved.data.activities.len(), 2);
    assert!(saved
        .data
        .activities
        .iter()
        .all(|a| a.contribution_snapshot.is_none()
            && a.habit_name == "Historical name"
            && a.spheres.len() == 2));
    assert!(saved
        .data
        .habits
        .iter()
        .find(|h| h.id == "read")
        .unwrap()
        .archived_at
        .is_some());
    reopened.close().await;
}

#[tokio::test]
async fn export_counts_new_json_bytes_before_fetch_and_rejects_invalid_stored_profiles() {
    let (_temporary, _, pool) = fixture().await;
    sqlx::query("DROP TRIGGER contribution_habit_update")
        .execute(&pool)
        .await
        .unwrap();
    sqlx::query("UPDATE habits SET contribution_profile_json=NULL WHERE id='read'")
        .execute(&pool)
        .await
        .unwrap();
    assert!(storage::export(&pool).await.is_err());
    let oversized = format!("{{\"padding\":\"{}\"}}", "x".repeat(model::MAX_BYTES));
    sqlx::query("UPDATE habits SET contribution_profile_json=?")
        .bind(oversized)
        .execute(&pool)
        .await
        .unwrap();
    assert!(storage::export(&pool)
        .await
        .unwrap_err()
        .contains("ограничения"));
    pool.close().await;
}

fn rhythm_input(kind: MutationKind, id: &str, change: RhythmChange) -> HabitMutation {
    let definition = matches!(kind, MutationKind::Create | MutationKind::Update);
    HabitMutation {
        kind,
        id: id.into(),
        name: definition.then(|| "Гитара 'без потери истории'".into()),
        spheres: definition.then(|| vec!["mind".into(), "recovery".into()]),
        contribution_profile: definition
            .then(|| Profile::defaults(&vec!["mind".into(), "recovery".into()])),
        rhythm_change: change,
    }
}
#[test]
fn rhythm_calendar_boundaries_and_strict_native_input() {
    for (today, next) in [
        ("2026-11-01", "2026-11-02"),
        ("2026-11-02", "2026-11-09"),
        ("2026-12-31", "2027-01-04"),
        ("2024-02-29", "2024-03-04"),
        ("2026-03-08", "2026-03-09"),
    ] {
        assert_eq!(crate::rhythm::monday(today).unwrap(), next);
    }
    for invalid in ["2025-02-29", "0000-01-01", "2026-13-01"] {
        assert!(crate::rhythm::day(invalid).is_err());
    }
    let base = serde_json::json!({"kind":"create","id":"new","name":"Name","spheres":["mind"],"contributionProfile":Profile::defaults(&vec!["mind".into()]),"rhythmChange":{"kind":"set","frequency":"daily"}});
    for frequency in ["whenever", "three-per-week", ""] {
        let mut bad = base.clone();
        bad["rhythmChange"]["frequency"] = serde_json::json!(frequency);
        assert!(serde_json::from_value::<HabitMutation>(bad).is_err());
    }
    let mut bad = base;
    bad["today"] = serde_json::json!("1999-01-01");
    assert!(
        serde_json::from_value::<HabitMutation>(bad).is_err(),
        "caller cannot choose native effective day"
    );
}
#[tokio::test]
async fn native_rhythm_enrollment_pending_replace_cancel_and_reopen_are_atomic() {
    let (_temp, path, pool) = fixture().await;
    let before = storage::export(&pool).await.unwrap();
    assert!(before.data.frequency_segments.is_empty());
    for (id, freq) in [
        ("new-daily", Frequency::Daily),
        ("new-three", Frequency::ThreePerWeek),
        ("new-weekly", Frequency::Weekly),
    ] {
        let result = crate::rhythm::mutate(
            &pool,
            &rhythm_input(
                MutationKind::Create,
                id,
                RhythmChange::Set {
                    frequency: freq.clone(),
                },
            ),
            "2026-10-28",
            "2026-10-28T12:00:00Z",
        )
        .await
        .unwrap();
        assert_eq!(result.frequency_segments[0].frequency, freq);
        assert_eq!(result.frequency_segments[0].effective_on, "2026-10-28");
    }
    let first = crate::rhythm::mutate(
        &pool,
        &rhythm_input(
            MutationKind::Update,
            "new-weekly",
            RhythmChange::Set {
                frequency: Frequency::Daily,
            },
        ),
        "2026-10-29",
        "2026-10-29T12:00:00Z",
    )
    .await
    .unwrap();
    let pending_id = first.frequency_segments[1].id.clone();
    assert_eq!(first.frequency_segments[1].effective_on, "2026-11-02");
    let replaced = crate::rhythm::mutate(
        &pool,
        &rhythm_input(
            MutationKind::Update,
            "new-weekly",
            RhythmChange::Set {
                frequency: Frequency::ThreePerWeek,
            },
        ),
        "2026-11-01",
        "2026-11-01T12:00:00Z",
    )
    .await
    .unwrap();
    assert_eq!(replaced.frequency_segments.len(), 2);
    assert_eq!(replaced.frequency_segments[1].id, pending_id);
    assert_eq!(replaced.frequency_segments[0], first.frequency_segments[0]);
    let canceled = crate::rhythm::mutate(
        &pool,
        &rhythm_input(
            MutationKind::Update,
            "new-weekly",
            RhythmChange::CancelPending,
        ),
        "2026-11-01",
        "2026-11-01T12:00:00Z",
    )
    .await
    .unwrap();
    assert_eq!(canceled.frequency_segments.len(), 1);
    let pending = crate::rhythm::mutate(
        &pool,
        &rhythm_input(
            MutationKind::Update,
            "new-weekly",
            RhythmChange::Set {
                frequency: Frequency::Daily,
            },
        ),
        "2026-11-01",
        "2026-11-01T12:00:00Z",
    )
    .await
    .unwrap();
    let next = crate::rhythm::mutate(
        &pool,
        &rhythm_input(
            MutationKind::Update,
            "new-weekly",
            RhythmChange::Set {
                frequency: Frequency::ThreePerWeek,
            },
        ),
        "2026-11-02",
        "2026-11-02T12:00:00Z",
    )
    .await
    .unwrap();
    assert_eq!(next.frequency_segments.len(), 3);
    assert_eq!(next.frequency_segments[1], pending.frequency_segments[1]);
    assert_eq!(next.frequency_segments[2].effective_on, "2026-11-09");
    let snapshot = storage::export(&pool).await.unwrap();
    pool.close().await;
    let reopened = connect(&path).await;
    migrate(&reopened, 5).await;
    assert_eq!(
        storage::export(&reopened).await.unwrap().data,
        snapshot.data
    );
    reopened.close().await;
}
#[tokio::test]
async fn native_archive_unknown_start_actual_end_same_day_and_guarded_foreign_keys() {
    let (temp, path, pool) = fixture().await;
    storage::restore(&pool, &example(), &temp.path().join("setup"))
        .await
        .unwrap();
    let before = storage::export(&pool).await.unwrap();
    let restored = crate::rhythm::mutate(
        &pool,
        &rhythm_input(MutationKind::Restore, "read", RhythmChange::Keep),
        "2026-10-30",
        "2026-10-30T12:00:00Z",
    )
    .await
    .unwrap();
    assert_eq!(restored.archive_pauses[0].start_on, None);
    assert_eq!(restored.archive_pauses[0].provenance, "legacy_unknown");
    assert_eq!(
        restored.archive_pauses[0].end_exclusive_on.as_deref(),
        Some("2026-10-30")
    );
    crate::rhythm::mutate(
        &pool,
        &rhythm_input(MutationKind::Archive, "read", RhythmChange::Keep),
        "2026-10-31",
        "2026-10-31T12:00:00Z",
    )
    .await
    .unwrap();
    let state = storage::export(&pool).await.unwrap();
    assert_eq!(state.data.archive_pauses.len(), 2);
    assert_eq!(state.data.activities, before.data.activities);
    assert!(
        crate::rhythm::mutate(
            &pool,
            &rhythm_input(MutationKind::Restore, "read", RhythmChange::Keep),
            "2026-10-29",
            "2026-10-29T12:00:00Z"
        )
        .await
        .is_err(),
        "clock rollback cannot damage pause"
    );
    assert_eq!(storage::export(&pool).await.unwrap().data, state.data);
    let same = crate::rhythm::mutate(
        &pool,
        &rhythm_input(MutationKind::Restore, "read", RhythmChange::Keep),
        "2026-10-31",
        "2026-10-31T13:00:00Z",
    )
    .await
    .unwrap();
    assert_eq!(
        same.archive_pauses.len(),
        1,
        "same-day known pause excluded,legacy unknown retained"
    );
    pool.close().await;
    let single = SqlitePoolOptions::new()
        .max_connections(1)
        .connect_with(
            SqliteConnectOptions::new()
                .filename(&path)
                .foreign_keys(false),
        )
        .await
        .unwrap();
    sqlx::query("PRAGMA foreign_keys=OFF")
        .execute(&single)
        .await
        .unwrap();
    crate::rhythm::mutate(
        &single,
        &rhythm_input(MutationKind::Update, "guitar", RhythmChange::Keep),
        "2026-11-01",
        "2026-11-01T12:00:00Z",
    )
    .await
    .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, i64>("PRAGMA foreign_keys")
            .fetch_one(&single)
            .await
            .unwrap(),
        1
    );
    assert!(sqlx::query("INSERT INTO habit_frequency_segments VALUES('orphan','absent','daily','2026-10-28','2026-10-28',1)").execute(&single).await.is_err());
    single.close().await;
}
#[tokio::test]
async fn native_definition_rhythm_failure_rolls_back_all_changes() {
    let (_temp, _path, pool) = fixture().await;
    let before = storage::export(&pool).await.unwrap().data;
    sqlx::query("CREATE TRIGGER synthetic_fail_rhythm BEFORE INSERT ON habit_frequency_segments BEGIN SELECT RAISE(ABORT,'synthetic'); END").execute(&pool).await.unwrap();
    assert!(crate::rhythm::mutate(
        &pool,
        &rhythm_input(
            MutationKind::Create,
            "never-partial",
            RhythmChange::Set {
                frequency: Frequency::Daily
            }
        ),
        "2026-10-28",
        "2026-10-28T12:00:00Z"
    )
    .await
    .is_err());
    assert_eq!(storage::export(&pool).await.unwrap().data, before);
    sqlx::query("DROP TRIGGER synthetic_fail_rhythm")
        .execute(&pool)
        .await
        .unwrap();
    assert!(crate::rhythm::mutate(
        &pool,
        &rhythm_input(
            MutationKind::Create,
            "missing-frequency",
            RhythmChange::Keep
        ),
        "2026-10-28",
        "2026-10-28T12:00:00Z"
    )
    .await
    .is_err());
    assert_eq!(storage::export(&pool).await.unwrap().data, before);
}
fn old_v2_bytes() -> Vec<u8> {
    let mut value = serde_json::to_value(example()).unwrap();
    value["formatVersion"] = serde_json::json!(2);
    value["databaseSchemaVersion"] = serde_json::json!(4);
    value["data"]
        .as_object_mut()
        .unwrap()
        .remove("frequencySegments");
    value["data"]
        .as_object_mut()
        .unwrap()
        .remove("archivePauses");
    serde_json::to_vec(&value).unwrap()
}
#[tokio::test]
async fn v3_histories_round_trip_old_v1_v2_import_and_native_protective_undo() {
    let (temp, path, pool) = fixture().await;
    let input = example();
    storage::restore(&pool, &input, &temp.path().join("setup"))
        .await
        .unwrap();
    let before = storage::export(&pool).await.unwrap();
    assert_eq!(before.data.frequency_segments.len(), 2);
    for bytes in [old_v1_bytes(), old_v2_bytes()] {
        let old = model::parse(&bytes).unwrap();
        assert!(old.data.frequency_segments.is_empty());
        assert_eq!(old.data.archive_pauses[0].start_on, None);
        assert_eq!(old.data.archive_pauses[0].provenance, "legacy_unknown");
        let safety = storage::restore(&pool, &old, &temp.path().join("recovery"))
            .await
            .unwrap();
        let recovered = storage::read_backup(&safety).unwrap();
        assert_eq!(recovered.format_version, 3);
        assert_eq!(recovered.data, before.data);
        assert_eq!(storage::export(&pool).await.unwrap().data, old.data);
        storage::restore(&pool, &recovered, &temp.path().join("undo"))
            .await
            .unwrap();
        assert_eq!(storage::export(&pool).await.unwrap().data, before.data);
    }
    pool.close().await;
    let reopened = connect(&path).await;
    migrate(&reopened, 5).await;
    assert_eq!(storage::export(&reopened).await.unwrap().data, before.data);
    reopened.close().await;
}
#[test]
fn strict_v3_rejects_missing_unknown_out_of_order_inconsistent_frequency_and_archive_history() {
    let value = serde_json::to_value(example()).unwrap();
    for collection in ["frequencySegments", "archivePauses"] {
        let mut bad = value.clone();
        bad["data"].as_object_mut().unwrap().remove(collection);
        assert!(model::parse(&serde_json::to_vec(&bad).unwrap()).is_err());
    }
    for (field, bad_value) in [
        ("frequency", serde_json::json!("whenever")),
        ("effectiveOn", serde_json::json!("2026-11-03")),
        ("createdOn", serde_json::json!("2025-02-29")),
        ("habitId", serde_json::json!("absent")),
        ("version", serde_json::json!(2)),
    ] {
        let mut bad = value.clone();
        bad["data"]["frequencySegments"][1][field] = bad_value;
        assert!(model::parse(&serde_json::to_vec(&bad).unwrap()).is_err());
    }
    let mut bad = value.clone();
    bad["data"]["frequencySegments"]
        .as_array_mut()
        .unwrap()
        .reverse();
    assert!(model::parse(&serde_json::to_vec(&bad).unwrap()).is_err());
    for (field, bad_value) in [
        ("startOn", serde_json::json!("2026-10-27")),
        ("provenance", serde_json::json!("recorded")),
        ("habitId", serde_json::json!("absent")),
        ("endExclusiveOn", serde_json::json!("2025-02-29")),
    ] {
        let mut bad = value.clone();
        bad["data"]["archivePauses"][0][field] = bad_value;
        assert!(model::parse(&serde_json::to_vec(&bad).unwrap()).is_err());
    }
    let mut bad = value.clone();
    bad["data"]["habits"][1]["archivedAt"] = serde_json::Value::Null;
    assert!(model::parse(&serde_json::to_vec(&bad).unwrap()).is_err());
    let mut old: serde_json::Value = serde_json::from_slice(&old_v2_bytes()).unwrap();
    old["data"]["frequencySegments"] = serde_json::json!([]);
    assert!(model::parse(&serde_json::to_vec(&old).unwrap()).is_err());
}
#[tokio::test]
async fn v3_replacement_failure_keeps_histories_and_snapshots_together() {
    let (temp, _path, pool) = fixture().await;
    storage::restore(&pool, &example(), &temp.path().join("setup"))
        .await
        .unwrap();
    let before = storage::export(&pool).await.unwrap().data;
    assert!(storage::replace(
        &pool,
        &example(),
        |_| Ok(temp.path().join("synthetic-safety")),
        || Err("synthetic after-delete failure".into())
    )
    .await
    .is_err());
    assert_eq!(storage::export(&pool).await.unwrap().data, before);
    let mut invalid = example();
    invalid.data.frequency_segments[0].effective_on = "2025-02-29".into();
    assert!(storage::replace(
        &pool,
        &invalid,
        |_| panic!("malformed input must not start replacement"),
        || Ok(())
    )
    .await
    .is_err());
    assert_eq!(storage::export(&pool).await.unwrap().data, before);
}

#[tokio::test]
async fn migration_five_failure_rolls_back_ddl_and_sqlx_ledger_then_retries() {
    let temp = TempDir::new().unwrap();
    let path = temp.path().join("migration-five.db");
    let pool = connect(&path).await;
    migrate(&pool, 4).await;
    sqlx::query("CREATE TABLE habit_archive_pauses(synthetic_conflict TEXT)")
        .execute(&pool)
        .await
        .unwrap();
    assert!(make_migrator(5).run(&pool).await.is_err());
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT MAX(version) FROM _sqlx_migrations")
            .fetch_one(&pool)
            .await
            .unwrap(),
        4
    );
    assert_eq!(
        sqlx::query_scalar::<_, i64>(
            "SELECT COUNT(*) FROM sqlite_master WHERE name='habit_frequency_segments'"
        )
        .fetch_one(&pool)
        .await
        .unwrap(),
        0
    );
    sqlx::query("DROP TABLE habit_archive_pauses")
        .execute(&pool)
        .await
        .unwrap();
    migrate(&pool, 5).await;
    let before = storage::export(&pool).await.unwrap().data;
    pool.close().await;
    let reopened = connect(&path).await;
    migrate(&reopened, 5).await;
    assert_eq!(storage::export(&reopened).await.unwrap().data, before);
    reopened.close().await;
}
