use tauri::{
    menu::{CheckMenuItem, Menu, MenuItem, MenuItemKind},
    tray::TrayIconBuilder,
    AppHandle, Manager,
};
use tauri_plugin_autostart::ManagerExt;

pub fn create_tray(app: &AppHandle) -> tauri::Result<()> {
    let accelerator = None::<&str>;
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, accelerator)?;
    let hide_item = MenuItem::with_id(app, "hide", "Hide", true, accelerator)?;

    let is_autostart_enabled = app.autolaunch().is_enabled().unwrap_or(false);
    let autostart_item = CheckMenuItem::with_id(
        app,
        "autostart",
        "Autostart",
        true,
        is_autostart_enabled,
        accelerator,
    )?;

    let menu = Menu::with_items(app, &[&autostart_item, &hide_item, &quit_item])?;

    let _ = TrayIconBuilder::with_id("tray")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(|app, event| {
            match event.id.as_ref() {
                "autostart" => {
                    if let Some(MenuItemKind::Check(item)) =
                        app.menu().and_then(|menu| menu.get("autostart"))
                    {
                        let is_autostart_enabled = app.autolaunch().is_enabled().unwrap_or(false);
                        if is_autostart_enabled {
                            app.autolaunch()
                                .disable()
                                .expect("Cannot disable autostart");
                            item.set_checked(false)
                                .expect("Cannot set autostart's checked state");
                        } else {
                            app.autolaunch().enable().expect("Cannot enable autostart");
                            item.set_checked(true)
                                .expect("Cannot set autostart's checked state");
                        }
                    }
                }
                "hide" => {
                    app.get_webview_window("main").unwrap().hide().unwrap();
                }
                "quit" => {
                    app.exit(0);
                }
                _ => {
                    //
                }
            }
        })
        .build(app)?;

    Ok(())
}
