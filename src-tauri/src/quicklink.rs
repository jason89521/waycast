#[tauri::command]
pub fn open_link(url: &str) {
    open::that(url).expect("Failed to open url");
}
