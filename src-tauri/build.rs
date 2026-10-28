fn main() {
    let manifest = tauri_build::AppManifest::new().commands(&[
        "export_backup",
        "preview_backup",
        "cancel_backup",
        "restore_backup",
    ]);
    tauri_build::try_build(tauri_build::Attributes::new().app_manifest(manifest))
        .expect("Tauri build configuration failed");
}
