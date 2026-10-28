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
    let parent = path
        .parent()
        .ok_or("Не удалось определить папку для копии.")?;
    let mut temporary =
        NamedTempFile::new_in(parent).map_err(|_| "Не удалось создать временный файл копии.")?;
    temporary
        .write_all(bytes)
        .and_then(|_| temporary.as_file().sync_all())
        .map_err(|_| "Не удалось полностью записать копию.")?;
    temporary
        .persist(path)
        .map_err(|_| "Не удалось завершить запись копии. Предыдущий файл не удалялся.")?;
    Ok(())
}

pub async fn snapshot(connection: &mut SqliteConnection) -> BackupResult<Backup> {
    let habit_rows = sqlx::query(
        "SELECT id, name, spheres_json, archived_at FROM habits ORDER BY rowid LIMIT 20001",
    )
    .fetch_all(&mut *connection)
    .await
    .map_err(|_| "Не удалось прочитать привычки.")?;
    let activity_rows = sqlx::query("SELECT id, habit_id, habit_name_snapshot, spheres_snapshot_json, occurred_on, recorded_at, timezone FROM activities ORDER BY rowid LIMIT 100001")
        .fetch_all(&mut *connection).await.map_err(|_| "Не удалось прочитать журнал.")?;
    let mut habits = Vec::new();
    for row in habit_rows {
        habits.push(Habit {
            id: row.get("id"),
            name: row.get("name"),
            archived_at: row.get("archived_at"),
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
            write_backup(&path, current)?;
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
        sqlx::query("INSERT INTO habits (id, name, spheres_json, archived_at) VALUES (?, ?, ?, ?)")
            .bind(&habit.id)
            .bind(&habit.name)
            .bind(serde_json::to_string(&habit.spheres).map_err(|_| "Ошибка сфер.")?)
            .bind(&habit.archived_at)
            .execute(&mut *transaction)
            .await
            .map_err(|_| "Не удалось восстановить привычки; транзакция отменена.")?;
    }
    for activity in &backup.data.activities {
        sqlx::query("INSERT INTO activities (id, habit_id, habit_name_snapshot, spheres_snapshot_json, occurred_on, recorded_at, timezone) VALUES (?, ?, ?, ?, ?, ?, ?)")
            .bind(&activity.id).bind(&activity.habit_id).bind(&activity.habit_name)
            .bind(serde_json::to_string(&activity.spheres).map_err(|_| "Ошибка снимка сфер.")?)
            .bind(&activity.occurred_on).bind(&activity.recorded_at).bind(&activity.timezone)
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
