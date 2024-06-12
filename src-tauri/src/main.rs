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

// ************************************************************************************
#[tauri::command]
fn greet(name: &str) -> String {
    println!("OK");
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn authenticate(authentication: &str) -> bool {
    let hash_auth = get_content("", "auth").unwrap_or_else(|err| {
        eprintln!("Error fetching content: {}", err);
        return false.to_string();
    });
    
    // match get_auth("gmail", "domain") {
    //     Ok(contents) => println!("{}", contents),
    //     Err(e) => eprintln!("Failed to get auth: {}", e),
    // }

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
fn save_password(key_str: String, directory: &str, filename: &str, plaintext: String) {
    let data = encrypt(key_str, plaintext);
    let _ = save_to_file(directory, filename, &data);
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
            let _ = create_directory("encrypt_data");
            let _ = hash_auth(b"wellplf@gmail.com\n123456789");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, delete_password, update_password, save_password, authenticate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}