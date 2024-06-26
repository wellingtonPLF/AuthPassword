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

// ****************************** RUNNING APP ********************************************

// #> npm run tauri dev
// #> npm run tauri build

// ***************************************************************************************

#[tauri::command]
fn check_auth() -> bool{
    match get_content("..", "authentication.bin") {
        Ok(_) => {
            true
        }
        Err(_) => {
            false
        }
    }
}

#[tauri::command]
fn registry(key: &str) -> bool{
    let result = hash_auth(key.as_bytes()).unwrap();
    result
}

#[tauri::command]
fn authenticate(authentication: &str) -> bool {
    let hash_auth = get_content("", "../authentication.bin").unwrap_or_else(|err| {
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
fn create_domain(directory: &str, content: &str) -> bool {
    println!("Creating Domain...");
    let full_path = format!("encrypt_data/{}", directory);
    let _ = create_directory(&full_path);
    let result = save_file(directory, "domain.txt", content).unwrap();
    println!("Domain Created!");
    result
    
}

#[tauri::command]
fn save_password(key_str: &str, directory: &str, password: &str) -> bool{
    println!("Saving Password...");
    let data = encrypt(key_str, password);
    let array_data = [data].to_vec();
    let filename = "auth.bin";
    let mut result = save_to_file(directory, filename, array_data).unwrap();
    if !result {
        let all_passwords = get_hex_password(key_str, directory, password);
        let update = all_passwords.join("\n");
        let value = update_file(directory, "auth.bin", &update).unwrap();
        println!("Password saved successfully!");
        result = value;
    }
    result
}

#[tauri::command]
fn update_password(key_str: &str, directory: &str, index: usize, password: &str) -> bool{
    println!("Updating Password...");
    let new_data = encrypt(key_str, password);

    match get_encryption(&directory, "auth.bin") {
        Ok(mut rows) => {
            if let Some(row_to_replace) = rows.get_mut(index) {
                *row_to_replace = new_data;
            }
        
            let update = rows.join("\n");
        
            let result = update_file(&directory, "auth.bin", &update).unwrap();
            println!("Password updated successfully!");
            result
        }
        Err(_) => {
            println!("Password Not updated!");
            false
        }
    }    
}

#[tauri::command]
fn get_all_domain() -> Vec<String> {
    let mut domain_array: Vec<String> = Vec::new();

    for dir_entry in fs::read_dir("src/encrypt_data").expect("Failed to read directory") {
        if let Ok(entry) = dir_entry {
            let path = entry.path();
            let name = path.file_name().expect("REASON").to_string_lossy();
            let content = get_content(&name, "domain.txt").unwrap_or_else(|err| {
                eprintln!("Error fetching content: {}", err);
                return false.to_string();
            });
            let result = &content[0..content.len() - 1];
            domain_array.push(result.to_string());
        }
    }

    domain_array
}

#[tauri::command]
fn get_auth(key_str: &str, directory: &str) -> Vec<String>{
    match get_encryption(directory, "auth.bin") {
        Ok(valid) => {
            let mut result = Vec::new();
            for encrypted_data in valid {
                let password = decrypt(key_str, &encrypted_data);
                result.push(password);
            }
            result
        }
        Err(_) => {
            Vec::new()
        }
    }
}

#[tauri::command]
fn delete_password(directory: &str, index: usize) -> bool{
    let mut rows = get_encryption(&directory, "auth.bin").unwrap();
    rows = splice(rows, index);
    let update = rows.join("\n");

    let result = update_file(&directory, "auth.bin", &update).unwrap();
    result
}

#[tauri::command]
fn delete_domain(directory: &str) -> bool{
    println!("Deleting Domain...");
    let result = delete_directory(directory);
    result
}

// ************************************************************************************

#[allow(dead_code)]
fn get_hex_password(key_str: &str, directory: &str, password: &str) -> Vec<String>{
    match get_encryption(directory, "auth.bin") {
        Ok(mut lines) => {
            println!("{:?}", lines);
            let new_data = encrypt(key_str, password);
            lines.push(new_data);
            lines
        }
        Err(_) => {
            Vec::new()
        }
    }
}

#[allow(dead_code)]
fn splice(mut array: Vec<String>, index: usize) -> Vec<String>{
    if index < array.len() {
        let _ = array.remove(index);
        array
    } 
    else {
        Vec::new()
    }
}

// ************************************************************************************

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            let _ = create_directory("encrypt_data");   
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            delete_password, 
            update_password, 
            get_all_domain, 
            delete_domain, 
            save_password,
            create_domain, 
            authenticate,             
            check_auth,
            get_auth,
            registry
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}