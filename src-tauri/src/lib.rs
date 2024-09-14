use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;

mod global_shortcut;
mod quicklink;
mod tray;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_dialog::init())
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
        .invoke_handler(tauri::generate_handler![quicklink::open_link,])
        .on_window_event(window::handle_window_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
