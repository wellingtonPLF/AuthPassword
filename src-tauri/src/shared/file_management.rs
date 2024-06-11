use std::{env};
use std::path::PathBuf;
use std::fs::{self, File};
use std::io::{self, Read, Write};
use std::error::Error;

#[allow(dead_code)]
pub fn get_auth(directory: &str, name: &str) -> Result<String, io::Error> {
    let file_path:&str = &format!("src/encrypt_data/{}/{}.txt", directory, name);
    let mut file = File::open(file_path)?;
    
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    
    Ok(contents)
}

#[allow(dead_code)]
pub fn get_directory(directory: &str, name: &str) -> Result<PathBuf, Box<dyn Error>> {
    let directory_name = &format!("src/encrypt_data/{}/{}", directory, name);
    let current_dir = env::current_dir()?;
    let file_path = current_dir.join(directory_name);

    Ok(file_path)
}

#[allow(dead_code)]
pub fn get_path(directory_path: PathBuf) -> Result<String, Box<dyn Error>> {
    let str_directory = directory_path.to_str().ok_or("Failed to convert path to string")?;
    let formated_path:&str = &format!(r#"{}"#, str_directory);

    Ok(formated_path.to_string())
}

#[allow(dead_code)]
pub fn get_encryption(directory: &str, name: &str) -> Result<String, io::Error> {
    let file_path = format!("src/encrypt_data/{}/{}", directory, name);
    let mut file = File::open(file_path)?;

    let mut contents = Vec::new();
    file.read_to_end(&mut contents)?;

    Ok(hex::encode(contents))
}

#[allow(dead_code)]
pub fn save_to_file(directory: &str, filename: &str, data: &[u8]) -> Result<(), Box<dyn std::error::Error>> {
    let directory_path = get_directory(directory, filename)?;
    let formated_path = get_path(directory_path.clone())?;

    if directory_path.exists() {
        println!("File already exists, not overwriting.");
    } 
    else {
        let mut file = File::create(formated_path).expect("failed to create file");
        file.write_all(data).expect("failed to write to file");
        println!("Encrypted data saved to {}", filename);   
    }

    Ok(())
}

#[allow(dead_code)]
pub fn save_file(directory: &str, name: &str, content: &str) -> Result<(), Box<dyn Error>>{
    let directory_path = get_directory(directory, name)?;
    let formated_path = get_path(directory_path.clone())?;

    if directory_path.exists() {
        println!("File already exists, not overwriting.");
    } 
    else {
        match File::create(formated_path) {
            Ok(mut file) => {
                if let Err(e) = writeln!(file, "{}", content) {
                    eprintln!("Failed to write to file: {:?}", e);
                }
                println!("File created successfully!");
            }
            Err(e) => eprintln!("Failed to create file: {:?}", e),
        }
    }

    Ok(())
}

#[allow(dead_code)]
pub fn create_directory(name: &str) -> Result<(), Box<dyn std::error::Error>> {
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
