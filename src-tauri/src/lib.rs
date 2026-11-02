use tauri_plugin_sql::{Migration, MigrationKind};
mod backup;
mod contributions;
mod rhythm;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "initial activity journal",
            sql: include_str!("../migrations/001_initial.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "archive habits without removing history",
            sql: include_str!("../migrations/002_archive_habits.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "seed sample habits once before backup restoration",
            sql: include_str!("../migrations/003_seed_once.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "subjective sphere contribution snapshots",
            sql: include_str!("../migrations/004_habit_contributions.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "habit frequency and archive history",
            sql: include_str!("../migrations/005_habit_rhythm.sql"),
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .manage(backup::BackupState::default())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            backup::export_backup,
            backup::preview_backup,
            backup::cancel_backup,
            backup::restore_backup,
            rhythm::mutate_habit
        ])
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:relics.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("failed to start Relics");
}
