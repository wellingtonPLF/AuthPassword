// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod shared {
    pub mod file_management;
    pub mod cryptography;
    pub mod hashing;
}

use shared::file_management::*;
use shared::hashing::*;
use shared::cryptography::*;

use std::fs;

// ************************************************************************************
#[tauri::command]
fn greet(name: &str) -> String {
    println!("OK");
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn authenticate(authentication: &str) -> bool {
    let hash_auth = get_content("", "auth.bin").unwrap_or_else(|err| {
        eprintln!("Error fetching content: {}", err);
        return false.to_string();
    });

    match verify_auth(authentication, &hash_auth) {
        Ok(valid) => {
            if valid {
                println!("Password is valid.");
                true
            } else {
                println!("Invalid password.");
                false
            }
        }
        Err(e) => {
            eprintln!("Error verifying password: {}", e);
            false
        }
    }
}

#[tauri::command]
fn create_auth(directory: &str, filename: &str, content: &str) {
    let _ = save_file(directory, filename, content);
}

#[tauri::command]
fn save_password(key_str: String, directory: &str, filename: &str, password: String) {
    let data = encrypt(key_str, password);
    let _ = save_to_file(directory, filename, &data);
}

// #[tauri::command]
fn get_all_domain() -> Vec<String> {
    let mut domains: Vec<String> = Vec::new();

    for dir_entry in fs::read_dir("src/encrypt_data").expect("Failed to read directory") {
        if let Ok(entry) = dir_entry {
            let path = entry.path();
            let name = path.file_name().expect("REASON").to_string_lossy();
            let content = get_content(&name, "domain.txt").unwrap_or_else(|err| {
                eprintln!("Error fetching content: {}", err);
                return false.to_string();
            });
            domains.push(content);
        }
    }

    domains
}

// #[tauri::command]
// fn get_all_auth() -> String{
//     format!("{}", id)
// }

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
            let _ = create_directory("encrypt_data");
            let _ = hash_auth(b"wellplf@gmail.com\n123456789");
            let x = get_all_domain();
            println!("{:?}", x);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, delete_password, update_password, save_password, authenticate, create_auth])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}