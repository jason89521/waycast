use tauri::Manager;

mod global_shortcut;
mod quicklink;
mod tray;
mod window;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(all(desktop))]
            {
                let handle = app.handle();
                let window = handle.get_webview_window("main").unwrap();
                // workaround for focus when start;
                window.hide()?;
                window.show()?;
                window.set_focus()?;
                tray::create_tray(handle)?;
                global_shortcut::register_global_shortcuts(app)?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![greet, quicklink::open_link])
        .on_window_event(window::handle_window_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
