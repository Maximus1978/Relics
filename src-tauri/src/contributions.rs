use serde::{Deserialize, Serialize};
pub const IDS: [&str; 5] = ["body", "mind", "relationships", "work", "recovery"];
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(deny_unknown_fields)]
pub struct Values {
    pub body: u8,
    pub mind: u8,
    pub relationships: u8,
    pub work: u8,
    pub recovery: u8,
}
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "kebab-case")]
pub enum Origin {
    User,
    LegacyDefault,
}
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(deny_unknown_fields)]
pub struct Profile {
    pub version: u8,
    pub origin: Origin,
    pub values: Values,
}
impl Profile {
    pub fn defaults(spheres: &[String]) -> Self {
        let value = |id: &str| {
            if spheres.iter().any(|s| s == id) {
                5
            } else {
                0
            }
        };
        Self {
            version: 1,
            origin: Origin::LegacyDefault,
            values: Values {
                body: value("body"),
                mind: value("mind"),
                relationships: value("relationships"),
                work: value("work"),
                recovery: value("recovery"),
            },
        }
    }
    pub fn validate(&self, spheres: &[String]) -> Result<(), String> {
        if self.version != 1
            || spheres.is_empty()
            || spheres.len() > 5
            || spheres
                .iter()
                .enumerate()
                .any(|(i, s)| !IDS.contains(&s.as_str()) || spheres[..i].contains(s))
        {
            return Err("Некорректный профиль вклада.".into());
        }
        let values = [
            self.values.body,
            self.values.mind,
            self.values.relationships,
            self.values.work,
            self.values.recovery,
        ];
        for (id, value) in IDS.iter().zip(values) {
            let selected = spheres.iter().any(|s| s == id);
            if selected {
                if !(1..=10).contains(&value)
                    || (self.origin == Origin::LegacyDefault && value != 5)
                {
                    return Err("Вклад выбранной сферы должен быть целым числом от 1 до 10.".into());
                }
            } else if value != 0 {
                return Err("Вклад невыбранной сферы должен быть нулём.".into());
            }
        }
        Ok(())
    }
}
