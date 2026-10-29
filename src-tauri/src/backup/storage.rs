use super::model::{self, Activity, Backup, BackupResult, Data, Habit};
use sqlx::{Connection, Row, SqliteConnection, SqlitePool};
use std::{
    fs::{self, File},
    io::{Read, Write},
    path::{Path, PathBuf},
};
use tempfile::NamedTempFile;

pub fn read_backup(path: &Path) -> BackupResult<Backup> {
    let file = File::open(path).map_err(|_| "Не удалось открыть выбранный файл.")?;
    if !file
        .metadata()
        .map_err(|_| "Не удалось проверить файл.")?
        .is_file()
    {
        return Err("Выберите обычный JSON-файл.".into());
    }
    let mut bytes = Vec::new();
    file.take((model::MAX_BYTES + 1) as u64)
        .read_to_end(&mut bytes)
        .map_err(|_| "Не удалось прочитать выбранный файл.")?;
    model::parse(&bytes)
}

pub fn write_backup(path: &Path, backup: &Backup) -> BackupResult<()> {
    let bytes = model::encode(backup)?;
    atomic_write(path, &bytes)
}

pub fn atomic_write(path: &Path, bytes: &[u8]) -> BackupResult<()> {
    publish(path, bytes, true)
}

fn publish(path: &Path, bytes: &[u8], overwrite: bool) -> BackupResult<()> {
    let parent = path
        .parent()
        .ok_or("Не удалось определить папку для копии.")?;
    let mut temporary =
        NamedTempFile::new_in(parent).map_err(|_| "Не удалось создать временный файл копии.")?;
    temporary
        .write_all(bytes)
        .and_then(|_| temporary.as_file().sync_all())
        .map_err(|_| "Не удалось полностью записать копию.")?;
    let published = if overwrite {
        temporary.persist(path)
    } else {
        temporary.persist_noclobber(path)
    }
    .map_err(|_| "Не удалось завершить запись копии. Предыдущий файл не удалялся.")?;
    if !overwrite {
        published
            .sync_all()
            .map_err(|_| "Не удалось подтвердить полную запись защитной копии.")?;
    }
    Ok(())
}

pub(crate) fn write_safety(path: &Path, backup: &Backup) -> BackupResult<()> {
    publish(path, &model::encode(backup)?, false)?;
    if read_backup(path)? != *backup {
        return Err("Защитная копия не прошла проверку; восстановление отменено.".into());
    }
    Ok(())
}

pub async fn snapshot(connection: &mut SqliteConnection) -> BackupResult<Backup> {
    let version: Option<i64> =
        sqlx::query_scalar("SELECT MAX(version) FROM _sqlx_migrations WHERE success=1")
            .fetch_one(&mut *connection)
            .await
            .map_err(|_| "Не удалось проверить версию базы.")?;
    if version != Some(model::SCHEMA_VERSION as i64) {
        return Err(
            "Версия базы не поддерживается. Закройте старые окна и обновите Relics.".into(),
        );
    }
    let habit_size = sqlx::query("SELECT COUNT(*) AS total, COALESCE(SUM(length(CAST(id AS BLOB)) + length(CAST(name AS BLOB)) + length(CAST(spheres_json AS BLOB)) + COALESCE(length(archived_at),0) + COALESCE(length(CAST(contribution_profile_json AS BLOB)),0)),0) AS bytes FROM habits")
        .fetch_one(&mut *connection).await.map_err(|_| "Не удалось проверить размер привычек.")?;
    let activity_size = sqlx::query("SELECT COUNT(*) AS total, COALESCE(SUM(length(CAST(id AS BLOB)) + length(CAST(habit_id AS BLOB)) + length(CAST(habit_name_snapshot AS BLOB)) + length(CAST(spheres_snapshot_json AS BLOB)) + length(occurred_on) + length(recorded_at) + length(timezone) + COALESCE(length(CAST(contribution_snapshot_json AS BLOB)),0)),0) AS bytes FROM activities")
        .fetch_one(&mut *connection).await.map_err(|_| "Не удалось проверить размер журнала.")?;
    if habit_size.get::<i64, _>("total") > model::MAX_HABITS as i64
        || activity_size.get::<i64, _>("total") > model::MAX_ACTIVITIES as i64
        || habit_size.get::<i64, _>("bytes") + activity_size.get::<i64, _>("bytes")
            > model::MAX_BYTES as i64
    {
        return Err(
            "Данные превышают ограничения резервного копирования; записи не были обрезаны.".into(),
        );
    }
    let habit_rows = sqlx::query(
        "SELECT id, name, spheres_json, archived_at, contribution_profile_json FROM habits ORDER BY rowid LIMIT 20001",
    )
    .fetch_all(&mut *connection)
    .await
    .map_err(|_| "Не удалось прочитать привычки.")?;
    let activity_rows = sqlx::query("SELECT id, habit_id, habit_name_snapshot, spheres_snapshot_json, occurred_on, recorded_at, timezone, contribution_snapshot_json FROM activities ORDER BY rowid LIMIT 100001")
        .fetch_all(&mut *connection).await.map_err(|_| "Не удалось прочитать журнал.")?;
    let mut habits = Vec::new();
    for row in habit_rows {
        habits.push(Habit {
            id: row.get("id"),
            name: row.get("name"),
            archived_at: row.get("archived_at"),
            contribution_profile: serde_json::from_str(
                &row.try_get::<String, _>("contribution_profile_json")
                    .map_err(|_| "Отсутствует профиль вклада привычки.")?,
            )
            .map_err(|_| "Некорректный профиль вклада привычки.")?,
            spheres: serde_json::from_str(row.get::<&str, _>("spheres_json"))
                .map_err(|_| "В локальной базе некорректные сферы; экспорт остановлен.")?,
        });
    }
    let mut activities = Vec::new();
    for row in activity_rows {
        activities.push(Activity {
            id: row.get("id"),
            habit_id: row.get("habit_id"),
            habit_name: row.get("habit_name_snapshot"),
            occurred_on: row.get("occurred_on"),
            recorded_at: row.get("recorded_at"),
            timezone: row.get("timezone"),
            contribution_snapshot: row
                .try_get::<Option<String>, _>("contribution_snapshot_json")
                .map_err(|_| "Не удалось прочитать снимок вклада.")?
                .map(|json| serde_json::from_str(&json).map_err(|_| "Некорректный снимок вклада."))
                .transpose()?,
            spheres: serde_json::from_str(row.get::<&str, _>("spheres_snapshot_json"))
                .map_err(|_| "В локальной базе некорректные снимки сфер; экспорт остановлен.")?,
        });
    }
    let backup = Backup::new(Data { habits, activities });
    backup.validate()?;
    Ok(backup)
}

pub async fn export(pool: &SqlitePool) -> BackupResult<Backup> {
    let mut transaction = pool
        .begin()
        .await
        .map_err(|_| "Не удалось начать чтение базы.")?;
    let backup = snapshot(&mut transaction).await?;
    transaction
        .commit()
        .await
        .map_err(|_| "Не удалось завершить чтение базы.")?;
    Ok(backup)
}

pub async fn restore(
    pool: &SqlitePool,
    backup: &Backup,
    directory: &Path,
) -> BackupResult<PathBuf> {
    fs::create_dir_all(directory)
        .map_err(|_| "Не удалось создать папку защитных копий. Восстановление отменено.")?;
    let path = directory.join(format!(
        "Relics-before-restore-{}-{}.json",
        chrono::Utc::now().format("%Y%m%dT%H%M%SZ"),
        uuid::Uuid::new_v4()
    ));
    replace(
        pool,
        backup,
        |current| {
            write_safety(&path, current)?;
            Ok(path.clone())
        },
        || Ok(()),
    )
    .await
}

pub(crate) async fn replace(
    pool: &SqlitePool,
    backup: &Backup,
    safety: impl FnOnce(&Backup) -> BackupResult<PathBuf>,
    after_delete: impl FnOnce() -> BackupResult<()>,
) -> BackupResult<PathBuf> {
    backup.validate()?;
    let mut connection = pool
        .acquire()
        .await
        .map_err(|_| "Не удалось получить соединение с базой.")?;
    sqlx::query("PRAGMA foreign_keys = ON")
        .execute(&mut *connection)
        .await
        .map_err(|_| "Не удалось включить проверку связей.")?;
    sqlx::query("PRAGMA synchronous = FULL")
        .execute(&mut *connection)
        .await
        .map_err(|_| "Не удалось включить надёжную запись SQLite.")?;
    let mut transaction = connection
        .begin_with("BEGIN IMMEDIATE")
        .await
        .map_err(|_| "База занята. Повторите восстановление позже.")?;
    let current = snapshot(&mut transaction).await?;
    let safety_path = safety(&current)?;
    sqlx::query("DELETE FROM activities")
        .execute(&mut *transaction)
        .await
        .map_err(|_| "Не удалось заменить журнал; транзакция отменена.")?;
    sqlx::query("DELETE FROM habits")
        .execute(&mut *transaction)
        .await
        .map_err(|_| "Не удалось заменить привычки; транзакция отменена.")?;
    after_delete()?;
    for habit in &backup.data.habits {
        sqlx::query("INSERT INTO habits (id, name, spheres_json, archived_at, contribution_profile_json) VALUES (?, ?, ?, ?, ?)")
            .bind(&habit.id)
            .bind(&habit.name)
            .bind(serde_json::to_string(&habit.spheres).map_err(|_| "Ошибка сфер.")?)
            .bind(&habit.archived_at)
            .bind(serde_json::to_string(&habit.contribution_profile).map_err(|_|"Ошибка профиля вклада.")?)
            .execute(&mut *transaction)
            .await
            .map_err(|_| "Не удалось восстановить привычки; транзакция отменена.")?;
    }
    for activity in &backup.data.activities {
        sqlx::query("INSERT INTO activities (id, habit_id, habit_name_snapshot, spheres_snapshot_json, occurred_on, recorded_at, timezone, contribution_snapshot_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
            .bind(&activity.id).bind(&activity.habit_id).bind(&activity.habit_name)
            .bind(serde_json::to_string(&activity.spheres).map_err(|_| "Ошибка снимка сфер.")?)
            .bind(&activity.occurred_on).bind(&activity.recorded_at).bind(&activity.timezone)
            .bind(activity.contribution_snapshot.as_ref().map(serde_json::to_string).transpose().map_err(|_|"Ошибка снимка вклада.")?)
            .execute(&mut *transaction).await.map_err(|_| "Не удалось восстановить действия; транзакция отменена.")?;
    }
    let violations = sqlx::query("PRAGMA foreign_key_check")
        .fetch_all(&mut *transaction)
        .await
        .map_err(|_| "Не удалось проверить связи восстановленных записей.")?;
    if !violations.is_empty() {
        return Err("Проверка связей не пройдена; восстановление отменено.".into());
    }
    transaction.commit().await.map_err(|_| "Не удалось завершить транзакцию восстановления. Перезапустите приложение и проверьте данные; защитная копия сохранена.")?;
    Ok(safety_path)
}
