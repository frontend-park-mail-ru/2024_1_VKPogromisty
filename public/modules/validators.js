const errors = {
    incorrectPasswordLength: "Пароль должен быть длиной в не менее 6 символов",
    passwordMismatch: "Пароли должны совпадать",
    incorrectEmail: "Неправильная почта",
    incorrectName: "Некорретное имя",
    impossibleDate: "Невозможная дата",
    incorrectPassword: "Некорректный пароль",
}

export function validatePassword(password) {
    if (password.length < 6) {
        return errors.incorrectPasswordLength;
    }
    if (password.match(/^[!+-A-Za-z]+$/) === null) {
        return errors.incorrectPassword;
    }
    return null;
}

export function validateEmail(email) {
    if (email.match(/^(\w)+@(\w)+\.(\w)+$/) === null) {
        return errors.incorrectEmail;
    }
    
    return null;
}

export function validatePasswords(password, repeatPassword) {

    if (password !== repeatPassword) {
        return errors.passwordMismatch;
    }

    if (validatePassword(password) !== null) {
        return errors.incorrectPassword;
    }

    return null;
}

export function validateDateOfBirth(inDay, inMonth, inYear) {

    if (Number.isNaN(inDay) || Number.isNaN(inMonth) || Number.isNaN(inYear)) {
        return errors.impossibleDate;
    }

    const day = Number(inDay);
    const month = Number(inMonth);
    const year = Number(inYear);
    const isVis = (year % 100 !== 0 || year % 400 === 0) && (year % 4 === 0);

    if (month === 2 && isVis && day === 29) {
        return null;
    }

    const date = new Date();

    if (date.getFullYear() - year >= 120) {
        return errors.impossibleDate;
    }

    const dayInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (day > dayInMonths[month - 1] && day < 1) {
        return errors.impossibleDate;
    }

    return null;
}

export function validateName(name) {
    if (name.match(/^[А-Яа-я]+$/) === null) {
        return errors.incorrectName;
    }

    return null;
}