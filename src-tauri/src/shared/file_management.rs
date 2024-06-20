use std::env;
use std::path::PathBuf;
use std::fs::{self, File, remove_file};
use std::io::{self, BufRead, BufReader, Read, Write};
use std::error::Error;

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
pub fn get_content(directory: &str, name: &str) -> Result<String, io::Error> {
    let file_path:&str = &format!("src/encrypt_data/{}/{}", directory, name);
    let mut file = File::open(file_path)?;
    
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    
    Ok(contents)
}

#[allow(dead_code)]
pub fn get_encryption(directory: &str, name: &str) -> Result<Vec<String>, io::Error> {
    let file_path = format!("src/encrypt_data/{}/{}", directory, name);
    let file = File::open(file_path)?;

    let mut hex_lines: Vec<String> = Vec::new();
    let reader = BufReader::new(file);

    for line in reader.lines() {
        let hex_string = line?;
        hex_lines.push(hex_string);
    }

    Ok(hex_lines)
}


#[allow(dead_code)]
pub fn save_to_file(directory: &str, filename: &str, data: Vec<String>) -> Result<bool, Box<dyn std::error::Error>> {
    let directory_path = get_directory(directory, filename)?;
    let formated_path = get_path(directory_path.clone())?;
    let mut result = true;

    if directory_path.exists() {
        result = false;
        println!("File already exists, not overwriting.");
    } 
    else {
        let mut file = File::create(formated_path).expect("failed to create file");

        for line in data {
            file.write_all(line.as_bytes()).expect("failed to write to file");
            file.write_all(b"\n")?;
        }
        println!("Encrypted data saved to {}", filename);   
    }

    Ok(result)
}

#[allow(dead_code)]
pub fn save_file(directory: &str, name: &str, content: &str) -> Result<bool, Box<dyn Error>>{
    let directory_path = get_directory(directory, name)?;
    let formated_path = get_path(directory_path.clone())?;
    let mut result = true;

    if directory_path.exists() {
        result = false;
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

    Ok(result)
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

#[allow(dead_code)]
pub fn delete_file(directory: &str, name: &str) -> Result<(), Box<dyn std::error::Error>> {
    let directory_name:&str = &format!("src/encrypt_data/{}/{}", directory,name);
    let current_dir = env::current_dir()?;
    let dir_path = current_dir.join(directory_name);
    match remove_file(dir_path) {
        Ok(()) => {
            println!("File '{}/{}' deleted successfully.", directory, name);
            Ok(())
        },
        Err(err) => {
            eprintln!("Error deleting file '{}/{}': {}", directory, name, err);
            Err(err.into()) // Convert the std::io::Error into Box<dyn std::error::Error>
        }
    }
}

#[allow(dead_code)]
pub fn delete_directory(directory: &str) -> bool {
    let directory_buff = get_directory(directory, "");
    let path = get_path(directory_buff.expect("REASON")).unwrap();
    match fs::remove_dir_all(path) {
        Ok(()) => {
            true
        },
        Err(_) => {
            false
        }
    }
}

#[allow(dead_code)]
pub fn update_file(directory: &str, name: &str, content: &str) -> Result<bool, Box<dyn Error>> {
    let directory_path = get_directory(directory, name)?;
    let formatted_path = get_path(directory_path.clone())?;
    let mut result = true;

    match File::create(&formatted_path) {
        Ok(mut file) => {
            if let Err(e) = file.write_all(content.as_bytes()) {
                eprintln!("Failed to write to file: {:?}", e);
                result = false;
            }
            file.flush()?;
            println!("File created successfully!");
        }
        Err(e) => {
            result = false;
            eprintln!("Failed to create file: {:?}", e);
        }
    }

    Ok(result)
}