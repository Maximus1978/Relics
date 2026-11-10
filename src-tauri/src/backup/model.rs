use crate::contributions::{Origin, Profile};
use crate::habit_icon::IconId;
use crate::rhythm::{self, ArchivePause, FrequencySegment};
use chrono::{DateTime, Datelike, NaiveDate, Utc};
use serde::{Deserialize, Deserializer, Serialize};
use std::collections::{HashMap, HashSet};

pub const MAX_BYTES: usize = 32 * 1024 * 1024;
pub const MAX_HABITS: usize = 20_000;
pub const MAX_ACTIVITIES: usize = 100_000;
pub const SCHEMA_VERSION: u32 = crate::DATABASE_SCHEMA_VERSION;
const FORMAT_VERSION: u32 = 4;

pub type BackupResult<T> = Result<T, String>;

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Habit {
    pub id: String,
    pub name: String,
    pub spheres: Vec<String>,
    #[serde(deserialize_with = "required_nullable")]
    pub archived_at: Option<String>,
    pub contribution_profile: Profile,
    pub icon_id: IconId,
}

fn required_nullable<'de, D: Deserializer<'de>, T: Deserialize<'de>>(
    deserializer: D,
) -> Result<Option<T>, D::Error> {
    Option::<T>::deserialize(deserializer)
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
    #[serde(deserialize_with = "required_nullable")]
    pub contribution_snapshot: Option<Profile>,
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Data {
    pub habits: Vec<Habit>,
    pub activities: Vec<Activity>,
    pub frequency_segments: Vec<FrequencySegment>,
    pub archive_pauses: Vec<ArchivePause>,
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
    pub target_schema_version: u32,
    pub user_entries: usize,
    pub default_entries: usize,
    pub legacy_entries: usize,
    pub frequency_segments: usize,
    pub configured_habits: usize,
    pub archive_pauses: usize,
}

impl Backup {
    pub fn new(data: Data) -> Self {
        Self {
            format: "relics-backup".into(),
            format_version: FORMAT_VERSION,
            exported_at: Utc::now().to_rfc3339(),
            app_version: env!("CARGO_PKG_VERSION").into(),
            database_schema_version: SCHEMA_VERSION,
            data,
        }
    }

    pub fn summary(&self) -> Summary {
        Summary {
            frequency_segments: self.data.frequency_segments.len(),
            configured_habits: self
                .data
                .frequency_segments
                .iter()
                .map(|s| &s.habit_id)
                .collect::<HashSet<_>>()
                .len(),
            archive_pauses: self.data.archive_pauses.len(),
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
            target_schema_version: SCHEMA_VERSION,
            user_entries: self
                .data
                .activities
                .iter()
                .filter(|a| {
                    a.contribution_snapshot
                        .as_ref()
                        .is_some_and(|p| p.origin == Origin::User)
                })
                .count(),
            default_entries: self
                .data
                .activities
                .iter()
                .filter(|a| {
                    a.contribution_snapshot
                        .as_ref()
                        .is_some_and(|p| p.origin == Origin::LegacyDefault)
                })
                .count(),
            legacy_entries: self
                .data
                .activities
                .iter()
                .filter(|a| a.contribution_snapshot.is_none())
                .count(),
        }
    }

    pub fn validate(&self) -> BackupResult<()> {
        if self.format != "relics-backup"
            || !matches!(
                (self.format_version, self.database_schema_version),
                (FORMAT_VERSION, SCHEMA_VERSION) | (3, 5) | (2, 4) | (1, 3)
            )
        {
            return Err("Неподдерживаемый формат или версия резервной копии. Нужны relics-backup v1/схема 3, v2/схема 4, v3/схема 5 или v4/схема 6.".into());
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
            habit.contribution_profile.validate(&habit.spheres)?;
            if !habit_ids.insert(habit.id.as_str()) {
                return Err("В копии повторяются идентификаторы привычек.".into());
            }
            if let Some(archived) = &habit.archived_at {
                timestamp(archived)?;
            }
        }
        let states: HashMap<String, bool> = self
            .data
            .habits
            .iter()
            .map(|h| (h.id.clone(), h.archived_at.is_some()))
            .collect();
        rhythm::validate_histories(
            &self.data.frequency_segments,
            &self.data.archive_pauses,
            &states,
        )?;
        let mut activity_ids = HashSet::new();
        let mut habit_days = HashSet::new();
        for activity in &self.data.activities {
            text(&activity.id, 256)?;
            text(&activity.habit_id, 256)?;
            text(&activity.habit_name, 4096)?;
            sphere_set(&activity.spheres)?;
            if let Some(profile) = &activity.contribution_snapshot {
                profile.validate(&activity.spheres)?;
            }
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

pub fn legacy_pauses(habits: &[Habit]) -> Vec<ArchivePause> {
    habits
        .iter()
        .filter(|h| h.archived_at.is_some())
        .map(|h| ArchivePause {
            id: uuid::Uuid::new_v4().to_string(),
            habit_id: h.id.clone(),
            start_on: None,
            end_exclusive_on: None,
            reason: "archive".into(),
            provenance: "legacy_unknown".into(),
        })
        .collect()
}

// Separate strict DTOs preserve each supported original version boundary.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct LegacyHabit {
    id: String,
    name: String,
    spheres: Vec<String>,
    #[serde(deserialize_with = "required_nullable")]
    archived_at: Option<String>,
    contribution_profile: Profile,
}

impl From<LegacyHabit> for Habit {
    fn from(old: LegacyHabit) -> Self {
        Self {
            id: old.id,
            name: old.name,
            spheres: old.spheres,
            archived_at: old.archived_at,
            contribution_profile: old.contribution_profile,
            icon_id: IconId::default(),
        }
    }
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct V2Data {
    habits: Vec<LegacyHabit>,
    activities: Vec<Activity>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct V3Data {
    habits: Vec<LegacyHabit>,
    activities: Vec<Activity>,
    frequency_segments: Vec<FrequencySegment>,
    archive_pauses: Vec<ArchivePause>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct LegacyBackup<T> {
    format: String,
    format_version: u32,
    exported_at: String,
    app_version: String,
    database_schema_version: u32,
    data: T,
}

impl<T> LegacyBackup<T> {
    fn upgrade(self, adapt: impl FnOnce(T) -> Data) -> Backup {
        Backup {
            format: self.format,
            format_version: self.format_version,
            exported_at: self.exported_at,
            app_version: self.app_version,
            database_schema_version: self.database_schema_version,
            data: adapt(self.data),
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct V1Habit {
    id: String,
    name: String,
    spheres: Vec<String>,
    #[serde(deserialize_with = "required_nullable")]
    archived_at: Option<String>,
}
#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct V1Activity {
    id: String,
    habit_id: String,
    habit_name: String,
    spheres: Vec<String>,
    occurred_on: String,
    recorded_at: String,
    timezone: String,
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct V1Data {
    habits: Vec<V1Habit>,
    activities: Vec<V1Activity>,
}
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct VersionProbe {
    format_version: u32,
}

pub fn parse(bytes: &[u8]) -> BackupResult<Backup> {
    if bytes.len() > MAX_BYTES {
        return Err("Файл превышает ограничение 32 МиБ.".into());
    }
    let error = || {
        "Не удалось прочитать JSON: неверные, повторяющиеся или неизвестные поля резервной копии."
            .to_string()
    };
    let probe: VersionProbe = serde_json::from_slice(bytes).map_err(|_| error())?;
    let backup = match probe.format_version {
        1 => serde_json::from_slice::<LegacyBackup<V1Data>>(bytes)
            .map_err(|_| error())?
            .upgrade(|old| {
                let habits: Vec<_> = old
                    .habits
                    .into_iter()
                    .map(|h| Habit {
                        contribution_profile: Profile::defaults(&h.spheres),
                        id: h.id,
                        name: h.name,
                        spheres: h.spheres,
                        archived_at: h.archived_at,
                        icon_id: IconId::default(),
                    })
                    .collect();
                let archive_pauses = legacy_pauses(&habits);
                Data {
                    habits,
                    activities: old
                        .activities
                        .into_iter()
                        .map(|a| Activity {
                            id: a.id,
                            habit_id: a.habit_id,
                            habit_name: a.habit_name,
                            spheres: a.spheres,
                            occurred_on: a.occurred_on,
                            recorded_at: a.recorded_at,
                            timezone: a.timezone,
                            contribution_snapshot: None,
                        })
                        .collect(),
                    archive_pauses,
                    ..Data::default()
                }
            }),
        2 => serde_json::from_slice::<LegacyBackup<V2Data>>(bytes)
            .map_err(|_| error())?
            .upgrade(|old| {
                let habits: Vec<Habit> = old.habits.into_iter().map(Into::into).collect();
                let archive_pauses = legacy_pauses(&habits);
                Data {
                    habits,
                    activities: old.activities,
                    archive_pauses,
                    frequency_segments: vec![],
                }
            }),
        3 => serde_json::from_slice::<LegacyBackup<V3Data>>(bytes)
            .map_err(|_| error())?
            .upgrade(|old| Data {
                habits: old.habits.into_iter().map(Into::into).collect(),
                activities: old.activities,
                archive_pauses: old.archive_pauses,
                frequency_segments: old.frequency_segments,
            }),
        FORMAT_VERSION => serde_json::from_slice::<Backup>(bytes).map_err(|_| error())?,
        _ => return Err("Неподдерживаемая версия копии. Обновите Relics.".into()),
    };
    backup.validate()?;
    Ok(backup)
}
pub fn encode(backup: &Backup) -> BackupResult<Vec<u8>> {
    backup.validate()?;
    if backup.format_version != FORMAT_VERSION || backup.database_schema_version != SCHEMA_VERSION {
        return Err("Экспорт без потери данных доступен только в формате v4.".into());
    }
    let mut bytes =
        serde_json::to_vec_pretty(backup).map_err(|_| "Не удалось подготовить JSON.")?;
    bytes.push(b'\n');
    if bytes.len() > MAX_BYTES {
        return Err("Копия превышает ограничение 32 МиБ; данные не были обрезаны.".into());
    }
    Ok(bytes)
}
