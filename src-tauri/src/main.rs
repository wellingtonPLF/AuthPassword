// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;
use argon2::password_hash::Error as PasswordHashError;
use std::{env, fmt::format};
use std::fs::{self, File};
use std::path::PathBuf;
// use std::path::Path;
use std::io::{self, Read, Write};
// use tauri::utils::config::parse;

use argon2::{
    password_hash::{
        rand_core::OsRng as OsRandom,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString
    },
    Argon2
};

// ************************************************************************************
use aes_gcm::{
    aead::{Aead, AeadCore, KeyInit, OsRng},
    Aes256Gcm, Key, 
    // Nonce
};
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
fn create_directory(name: &str) -> Result<(), Box<dyn std::error::Error>> {
    let directory_name:&str = &format!("src/{}", name);
    let current_dir = env::current_dir()?;
    let dir_path = current_dir.join(directory_name);
    let str_directory = dir_path.to_str().ok_or("")?;
    let formated_path:&str = &format!(r#"{}"#, str_directory);

    if let Err(e) = fs::create_dir_all(formated_path) {
        eprintln!("Failed to create directory: {:?}", e);
    }

    Ok(())
}

fn verify_auth(password: &str, parsed_hash: &str) -> Result<bool, PasswordHashError> {
    let parsed_hash = PasswordHash::new(parsed_hash)?;
    let result = Argon2::default().verify_password(password.as_bytes(), &parsed_hash).is_ok();
    Ok(result)
}

fn get_auth(directory: &str, name: &str) -> Result<String, io::Error> {
    let file_path:&str = &format!("src/encrypt_data/{}/{}.txt", directory, name);
    let mut file = File::open(file_path)?;
    
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    
    Ok(contents)
}

fn hash_auth() -> Result<(), PasswordHashError> {
    let password = b"12345678";
    let salt = SaltString::generate(&mut OsRandom);
    let argon2 = Argon2::default();
    let password_hash = argon2.hash_password(password, &salt)?.to_string();
    let parsed_hash = PasswordHash::new(&password_hash)?;
    let parsed_hash_str = parsed_hash.to_string();

    let _ = save_file("gmail", "auth", &parsed_hash_str);

    Ok(())
}

fn encrypt(key_str: String, plaintext: String) -> Vec<u8> {
    let key = Key::<Aes256Gcm>::from_slice(key_str.as_bytes());
    let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
    
    let cipher = Aes256Gcm::new(key);

    let ciphered_data = cipher.encrypt(&nonce, plaintext.as_bytes())
        .expect("failed to encrypt");

    // combining nonce and encrypted data together
    // for storage purpose
    let mut encrypted_data: Vec<u8> = nonce.to_vec();
    encrypted_data.extend_from_slice(&ciphered_data);

    encrypted_data
}

// fn decrypt(key_str: String, encrypted_data: String) -> String {
//     let encrypted_data = hex::decode(encrypted_data)
//         .expect("failed to decode hex string into vec");

//     let key = Key::<Aes256Gcm>::from_slice(key_str.as_bytes());

//     let (nonce_arr, ciphered_data) = encrypted_data.split_at(12);
//     let nonce = Nonce::from_slice(nonce_arr);

//     let cipher = Aes256Gcm::new(key);

//     let plaintext = cipher.decrypt(nonce, ciphered_data)
//         .expect("failed to decrypt data");

//     String::from_utf8(plaintext)
//         .expect("failed to convert vector of bytes to string")
// }

fn get_directory(directory: &str, name: &str) -> Result<PathBuf, Box<dyn Error>> {
    let directory_name = &format!("src/encrypt_data/{}/{}.txt", directory, name);
    let current_dir = env::current_dir()?;
    let file_path = current_dir.join(directory_name);

    Ok(file_path)
}

fn get_path(directory_path: PathBuf) -> Result<String, Box<dyn Error>> {
    let str_directory = directory_path.to_str().ok_or("Failed to convert path to string")?;
    let formated_path:&str = &format!(r#"{}"#, str_directory);

    Ok(formated_path.to_string())
}

fn save_to_file(filename: &str, data: &[u8]) {
    let mut file = File::create(filename).expect("failed to create file");
    file.write_all(data).expect("failed to write to file");
    println!("Encrypted data saved to {}", filename);
}


fn save_file(directory: &str, name: &str, content: &str) -> Result<(), Box<dyn Error>>{
    // let directory_name:&str = &format!("src/encrypt_data/{}/{}.txt", directory, name);
    // let current_dir = env::current_dir()?;
    // let file_path = current_dir.join(directory_name);
    // let str_directory = file_path.to_str().ok_or("")?;
    // let formated_path:&str = &format!(r#"{}"#, str_directory);

    let directory_path = get_directory(directory, name);
    let formated_path = get_path(directory_path?).unwrap();

    println!("{}", formated_path);

    // if directory_path.exists() {
    //     println!("File already exists, not overwriting.");
    // } 
    // else {
    //     match File::create(formated_path) {
    //         Ok(mut file) => {
    //             if let Err(e) = writeln!(file, "{}", content) {
    //                 eprintln!("Failed to write to file: {:?}", e);
    //             }
    //             println!("File created successfully!");
    //         }
    //         Err(e) => eprintln!("Failed to create file: {:?}", e),
    //     }
    // }
    

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            
            // let _ = create_directory("encrypt_data");
            // let _ = create_directory("encrypt_data/gmail");
            // let _ = save_file("gmail", "domain", "123456789");

            // match get_auth("gmail", "domain") {
            //     Ok(contents) => println!("{}", contents),
            //     Err(e) => eprintln!("Failed to get auth: {}", e),
            // }

            // let _ = hash_auth();

            // let valor = get_auth("gmail", "domain");
            // println!("{}", valor.unwrap());

            // match verify_auth(password, parsed_hash) {
            //     Ok(valid) => {
            //         if valid {
            //             println!("Password is valid.");
            //         } else {
            //             println!("Invalid password.");
            //         }
            //     }
            //     Err(e) => eprintln!("Error verifying password: {}", e),
            // }

            // ***********************************************************************************

            // let plaintext = "backendengineer.io".to_string();

            // let key_str = "thiskeystrmustbe32charlongtowork".to_string();

            // let encrypted_data = encrypt(key_str, plaintext);

            // let encoded_string = hex::encode(encrypted_data);
            // save_to_file("encrypted_data.bin", &encrypted_data);        

            let _ = save_file("gmail", "vish", "hello");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, delete_password, update_password, save_password])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}