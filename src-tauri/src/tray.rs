use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle, Manager,
};

pub fn create_tray(app: &AppHandle) -> tauri::Result<()> {
    let accelerator = None::<&str>;
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, accelerator)?;
    let hide_item = MenuItem::with_id(app, "hide", "Hide", true, accelerator)?;
    let menu = Menu::with_items(app, &[&hide_item, &quit_item])?;

    let _ = TrayIconBuilder::with_id("tray")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(|app, event| {
            match event.id.as_ref() {
                "hide" => {
                    app.get_webview_window("main").unwrap().hide().unwrap();
                }
                "quit" => app.exit(0),
                _ => {
                    //
                }
            }
        })
        .build(app)?;

    Ok(())
}
