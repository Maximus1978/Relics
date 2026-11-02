use crate::contributions::Profile;
use chrono::{Datelike, Days, NaiveDate};
use serde::{Deserialize, Deserializer, Serialize};
use sqlx::{Connection, Row, SqliteConnection, SqlitePool};
use std::collections::{HashMap, HashSet};
use tauri::{State, WebviewWindow};
use tauri_plugin_sql::{DbInstances, DbPool};
pub type Result<T> = std::result::Result<T, String>;
pub const MAX_SEGMENTS: usize = 100_000;
pub const MAX_PAUSES: usize = 100_000;

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Frequency {
    Daily,
    ThreePerWeek,
    Weekly,
}
pub fn day(value: &str) -> Result<NaiveDate> {
    let date =
        NaiveDate::parse_from_str(value, "%Y-%m-%d").map_err(|_| "Некорректная дата ритма.")?;
    if !(1..=9999).contains(&date.year()) || date.format("%Y-%m-%d").to_string() != value {
        return Err("Некорректная дата ритма.".into());
    }
    Ok(date)
}
pub fn monday(value: &str) -> Result<String> {
    let date = day(value)?;
    let offset = 7 - date.weekday().num_days_from_monday() as u64;
    let next = date
        .checked_add_days(Days::new(offset))
        .ok_or("Дата вне поддерживаемого диапазона.")?;
    let result = next.format("%Y-%m-%d").to_string();
    day(&result)?;
    Ok(result)
}
fn id(value: &str) -> Result<()> {
    if value.trim().is_empty() || value.chars().count() > 256 || value.contains('\0') {
        return Err("Некорректный идентификатор истории ритма.".into());
    }
    Ok(())
}
pub fn required_nullable<'de, D: Deserializer<'de>, T: Deserialize<'de>>(
    d: D,
) -> std::result::Result<Option<T>, D::Error> {
    Option::<T>::deserialize(d)
}
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct FrequencySegment {
    pub id: String,
    pub habit_id: String,
    pub frequency: Frequency,
    pub effective_on: String,
    pub created_on: String,
    pub version: u8,
}
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ArchivePause {
    pub id: String,
    pub habit_id: String,
    #[serde(deserialize_with = "required_nullable")]
    pub start_on: Option<String>,
    #[serde(deserialize_with = "required_nullable")]
    pub end_exclusive_on: Option<String>,
    pub reason: String,
    pub provenance: String,
}
pub fn validate_histories(
    segments: &[FrequencySegment],
    pauses: &[ArchivePause],
    habits: &HashMap<String, bool>,
) -> Result<()> {
    if segments.len() > MAX_SEGMENTS || pauses.len() > MAX_PAUSES {
        return Err("Слишком большая история ритма.".into());
    }
    let mut ids = HashSet::new();
    let mut previous: HashMap<&str, &FrequencySegment> = HashMap::new();
    for s in segments {
        id(&s.id)?;
        id(&s.habit_id)?;
        day(&s.created_on)?;
        day(&s.effective_on)?;
        if !habits.contains_key(&s.habit_id) || !ids.insert(&s.id) || s.version != 1 {
            return Err("Некорректная ссылка или версия ритма.".into());
        }
        if let Some(p) = previous.get(s.habit_id.as_str()) {
            if s.effective_on <= p.effective_on
                || s.created_on < p.effective_on
                || s.effective_on != monday(&s.created_on)?
            {
                return Err("Нарушен порядок или начало ритма.".into());
            }
        } else if s.effective_on != s.created_on {
            return Err("Первая настройка ритма должна начинаться в день выбора.".into());
        }
        previous.insert(&s.habit_id, s);
    }
    let mut ids = HashSet::new();
    let mut previous: HashMap<&str, &ArchivePause> = HashMap::new();
    let mut open = HashSet::new();
    for p in pauses {
        id(&p.id)?;
        id(&p.habit_id)?;
        if !habits.contains_key(&p.habit_id) || !ids.insert(&p.id) || p.reason != "archive" {
            return Err("Некорректная ссылка периода архива.".into());
        }
        match (&p.start_on, p.provenance.as_str()) {
            (Some(start), "recorded") => {
                day(start)?;
            }
            (None, "legacy_unknown") => {}
            _ => return Err("Неизвестное начало архива должно быть явно отмечено legacy.".into()),
        };
        if let Some(end) = &p.end_exclusive_on {
            day(end)?;
            if p.start_on.as_ref().is_some_and(|start| end <= start) {
                return Err("Некорректные границы архива.".into());
            }
        } else {
            open.insert(p.habit_id.as_str());
        }
        if let Some(old) = previous.get(p.habit_id.as_str()) {
            match (&old.end_exclusive_on, &p.start_on) {
                (Some(end), Some(start)) if start >= end => {}
                _ => return Err("Периоды архива пересекаются или не упорядочены.".into()),
            };
        }
        previous.insert(&p.habit_id, p);
    }
    for (habit, archived) in habits {
        if *archived != open.contains(habit.as_str()) {
            return Err("Текущий архив не согласован с историей пауз.".into());
        }
    }
    Ok(())
}
pub async fn histories(
    connection: &mut SqliteConnection,
) -> Result<(Vec<FrequencySegment>, Vec<ArchivePause>)> {
    let segments = sqlx::query(
        "SELECT * FROM habit_frequency_segments ORDER BY habit_id,effective_on,id LIMIT 100001",
    )
    .fetch_all(&mut *connection)
    .await
    .map_err(|_| "Не удалось прочитать историю ритма.")?
    .into_iter()
    .map(|r| -> Result<FrequencySegment> {
        Ok(FrequencySegment {
            id: r.get("id"),
            habit_id: r.get("habit_id"),
            frequency: serde_json::from_value(serde_json::Value::String(r.get("frequency")))
                .map_err(|_| "Неизвестный ритм.")?,
            effective_on: r.get("effective_on"),
            created_on: r.get("created_on"),
            version: r
                .get::<i64, _>("version")
                .try_into()
                .map_err(|_| "Неизвестная версия ритма.")?,
        })
    })
    .collect::<Result<Vec<_>>>()?;
    let pauses = sqlx::query(
        "SELECT * FROM habit_archive_pauses ORDER BY habit_id,start_on,id LIMIT 100001",
    )
    .fetch_all(&mut *connection)
    .await
    .map_err(|_| "Не удалось прочитать периоды архива.")?
    .into_iter()
    .map(|r| ArchivePause {
        id: r.get("id"),
        habit_id: r.get("habit_id"),
        start_on: r.get("start_on"),
        end_exclusive_on: r.get("end_exclusive_on"),
        reason: r.get("reason"),
        provenance: r.get("provenance"),
    })
    .collect();
    Ok((segments, pauses))
}
#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MutationKind {
    Create,
    Update,
    Archive,
    Restore,
}
#[derive(Clone, Debug, Default, Deserialize)]
#[serde(tag = "kind", rename_all = "snake_case", deny_unknown_fields)]
pub enum RhythmChange {
    #[default]
    Keep,
    Set {
        frequency: Frequency,
    },
    CancelPending,
}
#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HabitMutation {
    pub kind: MutationKind,
    pub id: String,
    pub name: Option<String>,
    pub spheres: Option<Vec<String>>,
    pub contribution_profile: Option<Profile>,
    #[serde(default)]
    pub rhythm_change: RhythmChange,
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Statement {
    sql: String,
    params: Vec<String>,
    check: Option<String>,
}
fn context(
    input: &HabitMutation,
    today: &str,
    now: &str,
) -> Result<HashMap<String, Option<String>>> {
    id(&input.id)?;
    day(today)?;
    chrono::DateTime::parse_from_rfc3339(now).map_err(|_| "Некорректное время записи.")?;
    let definition = matches!(input.kind, MutationKind::Create | MutationKind::Update);
    if definition {
        let name = input.name.as_ref().ok_or("Укажите название привычки.")?;
        if name.trim().is_empty()
            || name != name.trim()
            || name.chars().count() > 4096
            || name.contains('\0')
        {
            return Err("Укажите корректное название привычки.".into());
        }
        input
            .contribution_profile
            .as_ref()
            .ok_or("Отсутствует профиль вклада.")?
            .validate(input.spheres.as_ref().ok_or("Выберите сферы.")?)?;
    }
    if matches!(input.kind, MutationKind::Create)
        && !matches!(input.rhythm_change, RhythmChange::Set { .. })
    {
        return Err("Выберите ритм новой привычки.".into());
    }
    let (change, frequency) = match &input.rhythm_change {
        RhythmChange::Keep => ("keep", String::new()),
        RhythmChange::CancelPending => ("cancel_pending", String::new()),
        RhythmChange::Set { frequency } => (
            "set",
            serde_json::to_value(frequency)
                .unwrap()
                .as_str()
                .unwrap()
                .to_owned(),
        ),
    };
    let mut values = HashMap::from([
        ("id".into(), Some(input.id.clone())),
        ("name".into(), input.name.clone()),
        (
            "spheres".into(),
            input
                .spheres
                .as_ref()
                .map(serde_json::to_string)
                .transpose()
                .map_err(|_| "Некорректные сферы.")?,
        ),
        (
            "profile".into(),
            input
                .contribution_profile
                .as_ref()
                .map(serde_json::to_string)
                .transpose()
                .map_err(|_| "Некорректный вклад.")?,
        ),
    ]);
    for (k, v) in [
        ("change", change.into()),
        ("frequency", frequency),
        ("today", today.into()),
        ("nextMonday", monday(today)?),
        ("now", now.into()),
        ("segmentId", uuid::Uuid::new_v4().to_string()),
        ("pauseId", uuid::Uuid::new_v4().to_string()),
    ] {
        values.insert(k.into(), Some(v));
    }
    Ok(values)
}
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MutationReceipt {
    pub frequency_segments: Vec<FrequencySegment>,
    pub archive_pauses: Vec<ArchivePause>,
}

// One embedded bound SQL plan is shared with synthetic Node SQLite adapters; callers never supply SQL or dates.
pub async fn mutate(
    pool: &SqlitePool,
    input: &HabitMutation,
    today: &str,
    now: &str,
) -> Result<MutationReceipt> {
    let values = context(input, today, now)?;
    let plans: HashMap<String, Vec<Statement>> =
        serde_json::from_str(include_str!("../sql/habit_mutations.json"))
            .map_err(|_| "Ошибка встроенного плана записи.")?;
    let name = match input.kind {
        MutationKind::Create => "create",
        MutationKind::Update => "update",
        MutationKind::Archive => "archive",
        MutationKind::Restore => "restore",
    };
    let mut connection = pool.acquire().await.map_err(|_| "База занята.")?;
    sqlx::query("PRAGMA foreign_keys=ON")
        .execute(&mut *connection)
        .await
        .map_err(|_| "Не удалось включить связи SQLite.")?;
    let fk: i64 = sqlx::query_scalar("PRAGMA foreign_keys")
        .fetch_one(&mut *connection)
        .await
        .map_err(|_| "Не удалось проверить связи.")?;
    if fk != 1 {
        return Err("Связи SQLite отключены; изменение отменено.".into());
    }
    let mut tx = connection
        .begin_with("BEGIN IMMEDIATE")
        .await
        .map_err(|_| "База занята. Повторите изменение.")?;
    let version: Option<i64> =
        sqlx::query_scalar("SELECT MAX(version) FROM _sqlx_migrations WHERE success=1")
            .fetch_one(&mut *tx)
            .await
            .map_err(|_| "Не удалось проверить версию базы.")?;
    if version != Some(5) {
        return Err("Версия базы не поддерживается. Обновите Relics.".into());
    }
    for step in &plans[name] {
        if step.check.as_deref() == Some("valid") {
            let mut q = sqlx::query_scalar::<_, i64>(&step.sql);
            for key in &step.params {
                q = q.bind(
                    values
                        .get(key)
                        .ok_or("Ошибка параметра записи.")?
                        .as_deref(),
                );
            }
            if q.fetch_one(&mut *tx)
                .await
                .map_err(|_| "Не удалось проверить дату истории.")?
                != 1
            {
                return Err("Дата компьютера раньше сохранённой истории. Проверьте дату.".into());
            }
        } else {
            let mut q = sqlx::query(&step.sql);
            for key in &step.params {
                q = q.bind(
                    values
                        .get(key)
                        .ok_or("Ошибка параметра записи.")?
                        .as_deref(),
                );
            }
            let rows = q
                .execute(&mut *tx)
                .await
                .map_err(|_| {
                    "Не удалось сохранить привычку и историю. Изменение отменено.".to_string()
                })?
                .rows_affected();
            if step.check.as_deref() == Some("changed") && rows == 0 {
                return Err("Привычка не найдена. Обновите список.".into());
            }
        }
    }
    let (segments, pauses) = histories(&mut tx).await?;
    let habits = sqlx::query("SELECT id,archived_at IS NOT NULL AS archived FROM habits")
        .fetch_all(&mut *tx)
        .await
        .map_err(|_| "Не удалось проверить привычки.")?
        .into_iter()
        .map(|r| (r.get::<String, _>("id"), r.get::<i64, _>("archived") != 0))
        .collect();
    validate_histories(&segments, &pauses, &habits)?;
    tx.commit().await.map_err(|_| {
        "Не удалось завершить запись. Перезапустите Relics и проверьте данные.".to_string()
    })?;
    Ok(MutationReceipt {
        frequency_segments: segments
            .into_iter()
            .filter(|s| s.habit_id == input.id)
            .collect(),
        archive_pauses: pauses
            .into_iter()
            .filter(|p| p.habit_id == input.id)
            .collect(),
    })
}
#[tauri::command]
pub async fn mutate_habit(
    window: WebviewWindow,
    databases: State<'_, DbInstances>,
    input: HabitMutation,
) -> Result<MutationReceipt> {
    if window.label() != "main" {
        return Err("Команда доступна только в основном окне.".into());
    }
    let instances = databases.0.write().await;
    let Some(DbPool::Sqlite(pool)) = instances.get("sqlite:relics.db") else {
        return Err("Локальная база ещё не открыта.".into());
    };
    let today = chrono::Local::now().format("%Y-%m-%d").to_string();
    mutate(pool, &input, &today, &chrono::Utc::now().to_rfc3339()).await
}
