use argon2::password_hash::Error as PasswordHashError;
use argon2::{
    password_hash::{
        rand_core::OsRng as OsRandom,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString
    },
    Argon2
};

use crate::shared::file_management::save_file;

#[allow(dead_code)]
pub fn verify_auth(password: &str, parsed_hash: &str) -> Result<bool, PasswordHashError> {
    let parsed_hash = PasswordHash::new(parsed_hash.trim())?;
    let result = Argon2::default().verify_password(password.as_bytes(), &parsed_hash).is_ok();
    Ok(result)
}

#[allow(dead_code)]
pub fn hash_auth(password: &[u8]) -> Result<(), PasswordHashError> {
    let salt = SaltString::generate(&mut OsRandom);
    let argon2 = Argon2::default();
    let password_hash = argon2.hash_password(password, &salt)?.to_string();
    let parsed_hash = PasswordHash::new(&password_hash)?;
    let parsed_hash_str = parsed_hash.to_string();

    let _ = save_file("", "auth", &parsed_hash_str);

    Ok(())
}

