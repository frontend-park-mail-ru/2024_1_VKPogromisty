export function validatePassword(password) {
  return password.length >= 6;
}

export function validateEmail(email) {
  return email.match(/^[\w.]+@[\w.]+\.[\w.]+$/) !== null;
}

export function validateDateOfBirth(inDay, inMonth, inYear) {
  if (Number.isNaN(inDay) || Number.isNaN(inMonth) || Number.isNaN(inYear)) {
    return false;
  }

  const providedDate = new Date(inYear, inMonth - 1, inDay);

  if (
    providedDate.getDate() != inDay ||
    providedDate.getMonth() + 1 != inMonth ||
    providedDate.getFullYear() != inYear
  ) {
    return false;
  }

  return true;
}

export function validateName(name) {
  return name.match(/^[a-zа-я ,.'-]+$/i) !== null;
}
