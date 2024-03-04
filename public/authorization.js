import {validateEmail, validatePassword} from './modules/validators.js';
import {AuthService} from './modules/services.js';

const authService = new AuthService();

const result = await authService.isAuthorized();

if (result) {
    window.location.replace('/feed');
}

const email = document.getElementById('email');
const password = document.getElementById('password');

const incorrectEmail = document.getElementById('incorrect-email');
const incorrectPassword = document.getElementById('incorrect-password');

document.getElementById('button-sign-in').addEventListener('click', async () => {
    let flag = true;
    
    const emailErr = validateEmail(email.value);
    const passwordErr = validatePassword(password.value);

    if (emailErr !== null) {
        // вставить ошибку: например, incorrectEmail.innerHTML = emailErr;
        flag = false;
    }

    if (passwordErr !== null) {
        //incorrectPassword.innerHTML = passwordErr;
        flag = false;
    }

    if (!flag) {
        return;
    }

    const result = await authService.login(email.value, password.value);
    if (result) {
        window.location.replace('/feed');
    } else {
        return;//вписать "некорректные данные"
    }

});

document.getElementById('button-sign-up').addEventListener('click', () => {
    window.location.replace('/sign_up');
});