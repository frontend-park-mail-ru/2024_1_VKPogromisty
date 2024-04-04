const monthes = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/**
 * Remakes the date of birth in next format 'day month year'
 * @param {string} dateOfBirth - The date of birth
 * @returns {string}
 */
export function remakeDateOfBirth(dateOfBirth) {
  const date = new Date(dateOfBirth);

  return `${date.getDate()} ${monthes[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Remakes the date of creating post/account/message in next format 'day month year в minutes:hours'
 * @param {string} createdAt - The date of creating object
 * @returns {string}
 */
export function remakeCreatedAt(createdAt) {
  const date = new Date(createdAt);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${date.getDate()} ${monthes[date.getMonth()]} ${date.getFullYear()} в ${hours}:${minutes}`;
}
