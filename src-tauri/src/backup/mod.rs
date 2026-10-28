mod model;
mod storage;
#[cfg(test)]
mod tests;

use model::{Backup, BackupResult, Summary};
use serde::Serialize;
use std::path::PathBuf;
use tauri::{Manager, State, WebviewWindow};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_sql::{DbInstances, DbPool};
use tokio::sync::Mutex;

#[derive(Default)]
pub struct BackupState {
    operation: Mutex<()>,
    pending: Mutex<Option<Pending>>,
}

struct Pending {
    token: String,
    backup: Backup,
}

impl BackupState {
    async fn clear_pending(&self) {
        *self.pending.lock().await = None;
    }

    async fn take_pending(&self, token: &str) -> BackupResult<Backup> {
        let pending = self
            .pending
            .lock()
            .await
            .take()
            .ok_or("Сначала выберите и проверьте копию.")?;
        if pending.token != token {
            return Err("Предпросмотр устарел. Выберите копию заново.".into());
        }
        Ok(pending.backup)
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Preview {
    token: String,
    summary: Summary,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Receipt {
    summary: Summary,
    safety_file: String,
}

fn require_main(window: &WebviewWindow) -> BackupResult<()> {
    if window.label() != "main" {
        return Err("Команда доступна только в основном окне.".into());
    }
    if !cfg!(target_os = "windows") {
        return Err("Резервные копии пока доступны только в Windows.".into());
    }
    Ok(())
}

fn file_dialog(window: &WebviewWindow) -> tauri_plugin_dialog::FileDialogBuilder<tauri::Wry> {
    let dialog = window.dialog().file();
    #[cfg(desktop)]
    let dialog = dialog.set_parent(window);
    dialog
}

#[tauri::command]
pub async fn export_backup(
    window: WebviewWindow,
    state: State<'_, BackupState>,
    databases: State<'_, DbInstances>,
) -> BackupResult<Option<Summary>> {
    require_main(&window)?;
    let _operation = state
        .operation
        .try_lock()
        .map_err(|_| "Другая операция с копией ещё выполняется.")?;
    let snapshot = {
        let instances = databases.0.read().await;
        let Some(DbPool::Sqlite(pool)) = instances.get("sqlite:relics.db") else {
            return Err("Локальная база ещё не открыта.".into());
        };
        storage::export(pool).await?
    };
    let selected = file_dialog(&window)
        .set_title("Создать резервную копию Relics")
        .add_filter("JSON — резервная копия Relics", &["json"])
        .set_file_name(format!(
            "Relics-backup-{}.json",
            chrono::Local::now().format("%Y-%m-%d")
        ))
        .blocking_save_file();
    let Some(selected) = selected else {
        return Ok(None);
    };
    let path = selected
        .into_path()
        .map_err(|_| "Выберите локальный JSON-файл.")?;
    if !path
        .extension()
        .and_then(|extension| extension.to_str())
        .is_some_and(|extension| extension.eq_ignore_ascii_case("json"))
    {
        return Err("Выберите имя файла с расширением .json.".into());
    }
    storage::write_backup(&path, &snapshot)?;
    Ok(Some(snapshot.summary()))
}

#[tauri::command]
pub async fn preview_backup(
    window: WebviewWindow,
    state: State<'_, BackupState>,
) -> BackupResult<Option<Preview>> {
    require_main(&window)?;
    let _operation = state
        .operation
        .try_lock()
        .map_err(|_| "Другая операция с копией ещё выполняется.")?;
    state.clear_pending().await;
    let selected = file_dialog(&window)
        .set_title("Выбрать резервную копию Relics")
        .add_filter("JSON — резервная копия Relics", &["json"])
        .blocking_pick_file();
    let Some(selected) = selected else {
        return Ok(None);
    };
    let path = selected
        .into_path()
        .map_err(|_| "Выберите локальный JSON-файл.")?;
    let backup = storage::read_backup(&path)?;
    let token = uuid::Uuid::new_v4().to_string();
    let summary = backup.summary();
    *state.pending.lock().await = Some(Pending {
        token: token.clone(),
        backup,
    });
    Ok(Some(Preview { token, summary }))
}

#[tauri::command]
pub async fn cancel_backup(
    window: WebviewWindow,
    state: State<'_, BackupState>,
) -> BackupResult<()> {
    require_main(&window)?;
    let _operation = state
        .operation
        .try_lock()
        .map_err(|_| "Другая операция с копией ещё выполняется.")?;
    state.clear_pending().await;
    Ok(())
}

#[tauri::command]
pub async fn restore_backup(
    window: WebviewWindow,
    state: State<'_, BackupState>,
    databases: State<'_, DbInstances>,
    token: String,
) -> BackupResult<Receipt> {
    require_main(&window)?;
    let _operation = state
        .operation
        .try_lock()
        .map_err(|_| "Другая операция с копией ещё выполняется.")?;
    let backup = state.take_pending(&token).await?;
    let directory: PathBuf = window
        .app_handle()
        .path()
        .app_config_dir()
        .map_err(|_| "Не удалось определить папку восстановления.")?
        .join("recovery");
    let instances = databases.0.write().await;
    let Some(DbPool::Sqlite(pool)) = instances.get("sqlite:relics.db") else {
        return Err("Локальная база ещё не открыта.".into());
    };
    let safety = storage::restore(pool, &backup, &directory).await?;
    Ok(Receipt {
        summary: backup.summary(),
        safety_file: safety.to_string_lossy().into_owned(),
    })
}
