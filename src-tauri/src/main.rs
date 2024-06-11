// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod shared {
    pub mod file_management;
    pub mod cryptography;
    pub mod hashing;
}

// use shared::file_management::get_encryption;
// use shared::cryptography::decrypt;
// use shared::hashing::hash_auth;

// ************************************************************************************
#[tauri::command]
fn greet(name: &str) -> String {
    println!("OK");
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_password(id: &str) -> String{
    format!("{}", id)
}

#[tauri::command]
fn update_password(id: &str) -> String{
    format!("{}", id)
}

#[tauri::command]
fn delete_password(id: &str) -> String{
    format!("{}", id)
}
// ************************************************************************************

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, delete_password, update_password, save_password])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}