/**
 * Remakes the date of birth in next format 'day.month.year'
 * @param {string} dateOfBirth - The date of birth
 * @returns {string}
 */
export function remakeDateOfBirth(dateOfBirth) {
  const date = new Date(dateOfBirth);
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
}

/**
 * Remakes the date of creating post/account/message in next format 'day.month.year в minutes:hours'
 * @param {string} createdAt - The date of creating object
 * @returns {string}
 */
export function remakeCreatedAt(createdAt) {
  const date = new Date(createdAt);
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()} в ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}
