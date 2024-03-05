import { validateEmail, validatePassword } from "./modules/validators.js";
import { AuthService } from "./modules/services.js";
import { errors } from './modules/errors.js';

const authService = new AuthService();

const result = await authService.isAuthorized();

if (result.body) {
    window.location.replace("/feed");
}

const email = document.getElementById("email");
const password = document.getElementById("password");

const incorrectEmail = document.getElementById("incorrect-email");
const incorrectPassword = document.getElementById("incorrect-password");

function clearIncorrects() {
    incorrectEmail.innerHTML = '';
    incorrectPassword.innerHTML = '';
}

document
    .getElementById("button-sign-in")
    .addEventListener("click", async () => {

        clearIncorrects();

        let flag = true;

        if (!validateEmail(email.value)) {
            incorrectEmail.innerHTML = errors.incorrectEmail;
            flag = false;
        };
        if (!validatePassword(password.value)) {
            incorrectPassword.innerHTML = errors.incorrectPasswordLength;
            flag = false;
        };

        if (!flag) {
            return;
        }

        const result = await authService.login(email.value, password.value);

        if (result.ok) {
            console.log(result.body);
            const {avatar, firstName, lastName} = result.body.user;
            localStorage.setItem('avatar', avatar);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            window.location.replace('/feed');
        } else {
            incorrectEmail.innerHTML = "Некорректные данные";
            return;
        }

    });

document.getElementById("button-sign-up").addEventListener("click", () => {
    window.location.replace("/sign_up");
});
