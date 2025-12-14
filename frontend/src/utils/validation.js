// src/utils/validation.js

// --- Constants ---
export const MIN_PASSWORD_LENGTH = 6;
export const EXACT_PHONE_LENGTH = 10;
export const ROLE_OPTIONS = ['citizen', 'ngo', 'authority', 'admin'];

// --- Validation Functions ---

/**
 * Checks if a string is empty or just whitespace.
 * @param {string} value 
 */
export const isRequired = (value) => {
    return value && value.trim().length > 0;
};

/**
 * Checks for a basic email format.
 * @param {string} email 
 */
export const isValidEmail = (email) => {
    // Basic check for '@' and '.'
    if (!email || typeof email !== 'string') return false;
    return email.includes('@') && email.includes('.');
};

/**
 * Checks if the password meets the minimum length requirement.
 * @param {string} password 
 */
export const isValidPassword = (password) => {
    return password && password.length >= MIN_PASSWORD_LENGTH;
};

/**
 * Checks if the phone number is exactly 10 digits and only contains numbers.
 * @param {string} phone 
 */
export const isValidPhone = (phone) => {
    if (!phone) return false;
    return phone.length === EXACT_PHONE_LENGTH && /^\d{10}$/.test(phone);
};

/**
 * Checks if the role is one of the allowed options.
 * @param {string} role 
 */
export const isValidRole = (role) => {
    return ROLE_OPTIONS.includes(role);
};