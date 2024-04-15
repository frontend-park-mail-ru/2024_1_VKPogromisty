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
 * @param {string} inDay
 * @param {string} inMonth
 * @param {string} inYear
 * @returns {boolean}
 */
export function validateDateOfBirth(inDay, inMonth, inYear) {
  const intDay = parseInt(inDay);
  const intMonth = parseInt(inMonth);
  const intYear = parseInt(inYear);

  if (Number.isNaN(intDay) || Number.isNaN(intMonth) || Number.isNaN(intYear)) {
    return false;
  }

  const providedDate = new Date(intYear, intMonth - 1, intDay);
  const currentDate = new Date();

  if (
    providedDate.getDate() !== intDay ||
    providedDate.getMonth() + 1 !== intMonth ||
    providedDate.getFullYear() !== intYear ||
    intYear >= currentDate.getFullYear() ||
    intYear < 1900
  ) {
    return false;
  }

  return true;
}

/**
 * Validates the name, checks so it only contains letters, spaces, and some punctuation
 * @param {string} name
 * @returns {boolean}
 */
export function validateName(name) {
  return name.match(/^[a-zа-я ,.'-]+$/i) !== null;
}
