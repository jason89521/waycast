use tauri::{Window, WindowEvent};

pub fn handle_window_event(window: &Window, event: &WindowEvent) {
    match event {
        WindowEvent::CloseRequested { api, .. } => {
            window.hide().unwrap();
            api.prevent_close();
        }
        WindowEvent::Focused(focus) => {
            if !focus {
                #[cfg(not(debug_assertions))]
                {
                    window.hide().unwrap();
                }
            }
        }
        _ => {}
    }
}
