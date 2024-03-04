import {validateEmail, validatePasswords, validateName, validateDateOfBirth} from './modules/validators.js';
import {AuthService} from './modules/services.js';

const authService = new AuthService();

const email = document.getElementById('email');
const password = document.getElementById('password');
const repeatPassword = document.getElementById('repeat-password');
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const day = document.getElementById('day');
const month = document.getElementById('month');
const year = document.getElementById('year');

const incorrectEmail = document.getElementById('incorrect-email');
const incorrectPassword = document.getElementById('incorrect-password');
const incorrectRepeatPassword = document.getElementById('incorrect-repeat-password');
const incorrectFirstName = document.getElementById('incorrect-first-name');
const incorrectLastName = document.getElementById('incorrect-last-name');
const incorrectDateOfBirthday = document.getElementById('incorrect-date-of-birthday');

document.getElementById('submit-form').addEventListener('click', async () => {
    let flag = true;

    let errEmail = validateEmail(email.value)

    if (errEmail !== null) {
        //incorrectEmail.innerHTML = errEmail;
        flag = false;
    }

    let errRepeatPasswords = validatePasswords(password.value, repeatPassword.value);

    if (errRepeatPasswords !== null) {
        //incorrectRepeatPassword.innerHTML = errRepeatPasswords;
        flag = false;
    }

    let errFirstName = validateName(firstName.value);

    if (errFirstName !== null) {
        flag = false;
    }

    let errLastName = validateName(lastName.value);

    if (errLastName !== null) {
        flag = false;
    }

    let errDateOfBirth = validateDateOfBirth(day.value, month.value, year.value) ;

    if (errDateOfBirth !== null) {
        flag = false;
    }

    if (!flag) {
        return;
    }

    const result = await authService.login(email, password);
    if (result) {
        window.location.replace('/feed');
    } else {
        return;//тоже добавь типо "этот емейл уже занят"
    }

});

document.getElementById('sign-in-button').addEventListener('click', () => {
    window.location.replace('/login');
});