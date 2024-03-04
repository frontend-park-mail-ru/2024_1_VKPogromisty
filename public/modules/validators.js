export const errors = {
    incorrectPasswordLength: "Пароль должен быть длиной в не менее 6 символов",
    passwordMismatch: "Пароли должны совпадать",
    incorrectEmail: "Неправильная почта",
    incorrectName: "Некорретное имя",
    impossibleDate: "Невозможная дата",
    incorrectPassword: "Некорректный пароль",
}

export function validateEmail(email) {
    if (email.match(/^[\w.]+@[\w.]+\.[\w.]+$/) === null) {
        return errors.incorrectEmail;
    }
    
    return null;
}

export function validatePasswords(password, repeatPassword) {
    if (password.length < 6) {
        return errors.incorrectPasswordLength;
    }

    if (password !== repeatPassword) {
        return errors.passwordMismatch;
    }

    return null;
}

export function validateDateOfBirth(inDay, inMonth, inYear) {
    if (Number.isNaN(inDay) || Number.isNaN(inMonth) || Number.isNaN(inYear)) {
        return errors.impossibleDate;
    }

    const providedDate = new Date(inYear, inMonth - 1, inDay);

    if (providedDate.getDate() !== inDay || providedDate.getMonth() + 1 !== inMonth || providedDate.getFullYear() !== inYear) {
        return errors.impossibleDate;
    }

    const currentDate = new Date();
    const age = currentDate.getFullYear() - providedDate.getFullYear();

    if (age > 120) {
        return errors.impossibleDate;
    }

    return null;
}

export function validateName(name) {
    if (name.match(/^[А-Яа-яA-Za-z]+$/) === null) {
        return errors.incorrectName;
    }

    return null;
}