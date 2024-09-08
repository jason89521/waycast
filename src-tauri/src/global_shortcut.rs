use tauri::{App, Manager};
use tauri_plugin_global_shortcut::{Builder, Code, GlobalShortcutExt, Modifiers, Shortcut};

pub fn register_global_shortcuts(app: &mut App) -> anyhow::Result<()> {
    let alt_space = Shortcut::new(Some(Modifiers::ALT), Code::Space);
    app.handle().plugin(
        Builder::new()
            .with_handler(move |app, shortcut, _event| {
                println!("shortcut: {:?}", shortcut);
                if shortcut == &alt_space {
                    let window = app.get_webview_window("main").unwrap();
                    window.center().unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            })
            .build(),
    )?;

    app.global_shortcut().register(alt_space)?;

    Ok(())
}
