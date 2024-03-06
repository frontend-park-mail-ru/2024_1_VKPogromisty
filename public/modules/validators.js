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

    if (Number.isNaN(inDay) || Number.isNaN(inMonth) || Number.isNaN(inYear)) {
        return false;
    }

    const providedDate = new Date(inYear, inMonth - 1, inDay);

    if (providedDate.getDate() !== inDay || providedDate.getMonth() + 1 !== inMonth || providedDate.getFullYear() !== inYear) {
        return false;
    }

    const currentDate = new Date();
    const age = currentDate.getFullYear() - providedDate.getFullYear();

    if (age > 120) {
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