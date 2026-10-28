use chrono::{DateTime, Datelike, NaiveDate, Utc};
use serde::{Deserialize, Deserializer, Serialize};
use std::collections::HashSet;

pub const MAX_BYTES: usize = 32 * 1024 * 1024;
pub const MAX_HABITS: usize = 20_000;
pub const MAX_ACTIVITIES: usize = 100_000;
pub const SCHEMA_VERSION: u32 = 3;

pub type BackupResult<T> = Result<T, String>;

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Habit {
    pub id: String,
    pub name: String,
    pub spheres: Vec<String>,
    #[serde(deserialize_with = "required_nullable")]
    pub archived_at: Option<String>,
}

fn required_nullable<'de, D: Deserializer<'de>>(
    deserializer: D,
) -> Result<Option<String>, D::Error> {
    Option::<String>::deserialize(deserializer)
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Activity {
    pub id: String,
    pub habit_id: String,
    pub habit_name: String,
    pub spheres: Vec<String>,
    pub occurred_on: String,
    pub recorded_at: String,
    pub timezone: String,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(deny_unknown_fields)]
pub struct Data {
    pub habits: Vec<Habit>,
    pub activities: Vec<Activity>,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Backup {
    pub format: String,
    pub format_version: u32,
    pub exported_at: String,
    pub app_version: String,
    pub database_schema_version: u32,
    pub data: Data,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Summary {
    pub exported_at: String,
    pub habits: usize,
    pub archived_habits: usize,
    pub activities: usize,
    pub format_version: u32,
    pub database_schema_version: u32,
}

impl Backup {
    pub fn new(data: Data) -> Self {
        Self {
            format: "relics-backup".into(),
            format_version: 1,
            exported_at: Utc::now().to_rfc3339(),
            app_version: env!("CARGO_PKG_VERSION").into(),
            database_schema_version: SCHEMA_VERSION,
            data,
        }
    }

    pub fn summary(&self) -> Summary {
        Summary {
            exported_at: self.exported_at.clone(),
            habits: self.data.habits.len(),
            archived_habits: self
                .data
                .habits
                .iter()
                .filter(|habit| habit.archived_at.is_some())
                .count(),
            activities: self.data.activities.len(),
            format_version: self.format_version,
            database_schema_version: self.database_schema_version,
        }
    }

    pub fn validate(&self) -> BackupResult<()> {
        if self.format != "relics-backup"
            || self.format_version != 1
            || self.database_schema_version != SCHEMA_VERSION
        {
            return Err("Неподдерживаемый формат или версия резервной копии. Нужны relics-backup v1 и схема 3.".into());
        }
        timestamp(&self.exported_at)?;
        text(&self.app_version, 64)?;
        if self.data.habits.len() > MAX_HABITS || self.data.activities.len() > MAX_ACTIVITIES {
            return Err(
                "Слишком много записей: поддерживается до 20 000 привычек и 100 000 действий."
                    .into(),
            );
        }
        let mut habit_ids = HashSet::new();
        for habit in &self.data.habits {
            text(&habit.id, 256)?;
            text(&habit.name, 4096)?;
            sphere_set(&habit.spheres)?;
            if !habit_ids.insert(habit.id.as_str()) {
                return Err("В копии повторяются идентификаторы привычек.".into());
            }
            if let Some(archived) = &habit.archived_at {
                timestamp(archived)?;
            }
        }
        let mut activity_ids = HashSet::new();
        let mut habit_days = HashSet::new();
        for activity in &self.data.activities {
            text(&activity.id, 256)?;
            text(&activity.habit_id, 256)?;
            text(&activity.habit_name, 4096)?;
            sphere_set(&activity.spheres)?;
            let date = NaiveDate::parse_from_str(&activity.occurred_on, "%Y-%m-%d")
                .map_err(|_| "В копии есть некорректная дата действия.")?;
            if date.year() < 1
                || date.year() > 9999
                || date.format("%Y-%m-%d").to_string() != activity.occurred_on
            {
                return Err("В копии есть некорректная дата действия.".into());
            }
            timestamp(&activity.recorded_at)?;
            text(&activity.timezone, 128)?;
            activity
                .timezone
                .parse::<chrono_tz::Tz>()
                .map_err(|_| "В копии есть неизвестный часовой пояс IANA.")?;
            if !activity_ids.insert(activity.id.as_str()) {
                return Err("В копии повторяются идентификаторы действий.".into());
            }
            if !habit_ids.contains(activity.habit_id.as_str()) {
                return Err("Действие ссылается на отсутствующую привычку.".into());
            }
            if !habit_days.insert((activity.habit_id.as_str(), activity.occurred_on.as_str())) {
                return Err("В копии есть несколько отметок одной привычки на одну дату.".into());
            }
        }
        Ok(())
    }
}

fn text(value: &str, maximum: usize) -> BackupResult<()> {
    if value.trim().is_empty() || value.chars().count() > maximum || value.contains('\0') {
        return Err("В копии есть пустое, слишком длинное или недопустимое текстовое поле.".into());
    }
    Ok(())
}

fn timestamp(value: &str) -> BackupResult<()> {
    let parsed = DateTime::parse_from_rfc3339(value)
        .map_err(|_| "В копии есть некорректная временная метка RFC 3339.")?;
    if parsed.year() < 1 || parsed.year() > 9999 {
        return Err("Недопустимый год временной метки.".into());
    }
    Ok(())
}

fn sphere_set(values: &[String]) -> BackupResult<()> {
    let mut seen = HashSet::new();
    if values.is_empty() || values.len() > 5 {
        return Err("У записи должен быть непустой набор сфер.".into());
    }
    for value in values {
        if !matches!(
            value.as_str(),
            "body" | "mind" | "relationships" | "work" | "recovery"
        ) || !seen.insert(value)
        {
            return Err("В копии есть неизвестная или повторяющаяся сфера.".into());
        }
    }
    Ok(())
}

pub fn parse(bytes: &[u8]) -> BackupResult<Backup> {
    if bytes.len() > MAX_BYTES {
        return Err("Файл превышает ограничение 32 МиБ.".into());
    }
    let backup: Backup = serde_json::from_slice(bytes)
        .map_err(|_| "Не удалось прочитать JSON: неверные или неизвестные поля резервной копии.")?;
    backup.validate()?;
    Ok(backup)
}

pub fn encode(backup: &Backup) -> BackupResult<Vec<u8>> {
    backup.validate()?;
    let mut bytes =
        serde_json::to_vec_pretty(backup).map_err(|_| "Не удалось подготовить JSON.")?;
    bytes.push(b'\n');
    if bytes.len() > MAX_BYTES {
        return Err("Копия превышает ограничение 32 МиБ; данные не были обрезаны.".into());
    }
    Ok(bytes)
}
