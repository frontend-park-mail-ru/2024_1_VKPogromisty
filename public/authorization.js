import { validateEmail, validatePassword } from "./modules/validators.js";
import { AuthService } from "./modules/services.js";

const authService = new AuthService();

const result = await authService.isAuthorized();

if (result) {
    const userAvatar = localStorage.getItem("userAvatar");
    const userName = localStorage.getItem("userName");

    localStorage.setItem("userAvatar", userAvatar);
    localStorage.setItem("userName", userName);
    window.location.replace("/feed");
}

const email = document.getElementById("email");
const password = document.getElementById("password");

const incorrectEmail = document.getElementById("incorrect-email");
const incorrectPassword = document.getElementById("incorrect-password");

document
    .getElementById("button-sign-in")
    .addEventListener("click", async () => {
        let flag = true;

        const emailErr = validateEmail(email.value);
        const passwordErr = validatePassword(password.value);

        if (emailErr !== null) {
            incorrectEmail.innerHTML = emailErr;
            flag = false;
        } else {
            incorrectEmail.innerHTML = "";
        }

        if (passwordErr !== null) {
            incorrectPassword.innerHTML = passwordErr;
            flag = false;
        } else {
            incorrectPassword.innerHTML = "";
        }

<<<<<<< HEAD
        if (!flag) {
            return;
        }
=======
    const result = await authService.login(email.value, password.value);
    if (result !== null) {
        const {avatar, firstName, lastName} = result.body.user;
        localStorage.setItem('avatar', avatar);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        window.location.replace('/feed');
    } else {
        incorrectEmail.innerHTML = "Некорректные данные";
        incorrectPassword.innerHTML = "Некорректные данные";
        return;
    }
>>>>>>> origin/VKP-33-posts

    });

document.getElementById("button-sign-up").addEventListener("click", () => {
    window.location.replace("/sign_up");
});
