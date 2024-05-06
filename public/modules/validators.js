/**
 * Validates the password, checks if it's at least 6 characters long
 * @param {string} password
 * @returns {boolean}
 */
export function validatePassword(password) {
  return password.length >= 6;
}

/**
 * Validates the email
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  return email.match(/@/) !== null;
}

/**
 * Validates the date of birth
 * @param {string} date - The whole date
 * @returns {boolean}
 */
export function validateDateOfBirth(date) {
  if (date === "") {
    return false;
  }

  const year = date.split("-")[0];
  const currentDate = new Date();

  return new Date(date) <= currentDate && year >= 1900;
}

/**
 * Validates the name, checks so it only contains letters, spaces, and some punctuation
 * @param {string} name
 * @returns {boolean}
 */
export function validateName(name) {
  return name.match(/^[a-zа-я ,.'-]+$/i) !== null;
}
