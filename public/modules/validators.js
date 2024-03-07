export function validatePassword(password) {
  return password.length >= 6;
}

export function validateEmail(email) {
  return email.match(/^[\w.]+@[\w.]+\.[\w.]+$/) !== null;
}

export function validateDateOfBirth(inDay, inMonth, inYear) {
  const intDay = parseInt(inDay);
  const intMonth = parseInt(inMonth);
  const intYear = parseInt(inYear);

  if (Number.isNaN(intDay) || Number.isNaN(intMonth) || Number.isNaN(intYear)) {
    return false;
  }

  const providedDate = new Date(intYear, intMonth - 1, intDay);

  if (
    providedDate.getDate() !== intDay ||
    providedDate.getMonth() + 1 !== intMonth ||
    providedDate.getFullYear() !== intYear
  ) {
    return false;
  }

  return true;
}

export function validateName(name) {
  return name.match(/^[a-zа-я ,.'-]+$/i) !== null;
}
