use serde::{Deserialize, Deserializer, Serialize};

macro_rules! icon_ids {
    ($($variant:ident => $id:literal),+ $(,)?) => {
        #[derive(Clone, Copy, Debug, Default, Deserialize, PartialEq, Eq, Serialize)]
        pub enum IconId {
            #[default]
            #[serde(rename = "sigil")]
            Sigil,
            $(#[serde(rename = $id)] $variant),+
        }

        impl IconId {
            pub fn as_str(self) -> &'static str {
                match self {
                    Self::Sigil => "sigil",
                    $(Self::$variant => $id),+
                }
            }

            pub fn parse(value: &str) -> Result<Self, String> {
                match value {
                    "sigil" => Ok(Self::Sigil),
                    $($id => Ok(Self::$variant)),+,
                    _ => Err("Неизвестный значок привычки.".into()),
                }
            }
        }
    };
}

icon_ids! {
    Walk => "walk",
    Strength => "strength",
    Book => "book",
    Language => "language",
    Music => "music",
    Bicycle => "bicycle",
    Conversation => "conversation",
    Work => "work",
    Sleep => "sleep",
    Meditation => "meditation",
    Creativity => "creativity",
}

// An omitted edit keeps the saved icon. An explicit null is invalid.
pub fn optional_icon<'de, D>(deserializer: D) -> Result<Option<IconId>, D::Error>
where
    D: Deserializer<'de>,
{
    IconId::deserialize(deserializer).map(Some)
}
