export function validatePassword(password) {
    if (password.length < 6) {
        return false;
    }
    return true;
}

export function validateEmail(email) {
    if (email.match(/^[\w.]+@[\w.]+\.[\w.]+$/) === null) {
        return false;
    }
    
    return true;
}

export function validatePasswords(password, repeatPassword) {

    if (password !== repeatPassword) {
        return false;
    }

    return true;
}

export function validateDateOfBirth(inDay, inMonth, inYear) {

    if (Number.isNaN(Number(inDay)) || Number.isNaN(Number(inMonth)) || Number.isNaN(Number(inYear))) {
        return false;
    }

    const day = Number(inDay);
    const month = Number(inMonth);
    const year = Number(inYear);
    const isVis = (year % 100 !== 0 || year % 400 === 0) && (year % 4 === 0);

    if (month === 2 && isVis && day === 29) {
        return true;
    }

    const date = new Date();

    if (date.getFullYear() - year >= 120) {
        return false;
    }

    const dayInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (day > dayInMonths[month - 1] || day < 1) {
        return false;
    }

    return true;
}

export function validateName(name) {
    if (name.match(/^[А-Яа-яA-Za-z]+$/) === null) {
        return false;
    }

    return true;
}