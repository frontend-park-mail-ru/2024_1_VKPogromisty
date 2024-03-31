import {
  validateEmail,
  validatePassword,
  validateName,
} from "/public/modules/validators.js";
import { errors } from "/public/modules/errors.js";
import BaseView from "../../MVC/BaseView.js";

const INPUT_CORRECT = "form__input__correct";

const inputs = [
  {
    inscription: "Электронная почта",
    incorrect: "incorrect-email",
    incorrectText: errors.incorrectEmail,
    type: "text",
    id: "email",
    name: "email",
    placeholder: "Электронная почта",
    isPassword: false,
  },
  {
    inscription: "Пароль",
    incorrect: "incorrect-password",
    incorrectText: errors.incorrectPasswordLength,
    type: "password",
    id: "password",
    name: "password",
    placeholder: "Пароль",
    isPassword: true,
  },
];

class LoginView extends BaseView {
  constructor(eventBus) {
    super(eventBus);
    this.eventBus.addEventListener(
      "receiveLoginResult",
      this.handleLoginResult.bind(this),
    );

    this.eventBus.addEventListener(
      "serverError",
      this.handleServerError.bind(this),
    );
  }

  render(element) {
    const template = Handlebars.templates["login.hbs"];
    element.innerHTML = template({ inputs });

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const incorrectEmail = document.getElementById("incorrect-email");
    const incorrectPassword = document.getElementById("incorrect-password");
    const loginShowPassword = document.getElementById("login-show-password");

    email.addEventListener("focusout", () => {
      incorrectEmail.classList.add(INPUT_CORRECT);

      if (!validateEmail(email.value)) {
        incorrectEmail.classList.remove(INPUT_CORRECT);
      }
    });

    password.addEventListener("focusout", () => {
      incorrectPassword.classList.add(INPUT_CORRECT);

      if (!validatePassword(password.value)) {
        incorrectPassword.classList.remove(INPUT_CORRECT);
      }
    });

    loginShowPassword.addEventListener("click", () => {
      if (password.getAttribute("type") == "password") {
        password.setAttribute("type", "text");
      } else {
        password.setAttribute("type", "password");
      }
    });

    document
      .getElementById("button-sign-in")
      .addEventListener("click", async () => {
        await this.checkAndSubmitForm();
      });
  }

  handleLoginResult(result) {
    const repeatEmail = document.getElementById("repeat-email");

    if (result) {
      this.eventBus.emit("loginSuccess", "/feed");
    } else {
      repeatEmail.classList.remove(INPUT_CORRECT);
    }
  }

  handleServerError() {
    document.getElementById("server-error").classList.remove(INPUT_CORRECT);
  }

  checkAndSubmitForm() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const incorrectEmail = document.getElementById("incorrect-email");
    const incorrectPassword = document.getElementById("incorrect-password");
    const incorrectFormLogin = document.getElementById("incorrect-form-login");

    const repeatEmail = document.getElementById("repeat-email");

    incorrectEmail.classList.add(INPUT_CORRECT);
    incorrectPassword.classList.add(INPUT_CORRECT);

    let flag = true;

    if (!validateEmail(email.value)) {
      incorrectEmail.classList.remove(INPUT_CORRECT);
      flag = false;
    }
    if (!validatePassword(password.value)) {
      incorrectPassword.classList.remove(INPUT_CORRECT);
      flag = false;
    }

    if (!flag) {
      return false;
    }

    incorrectFormLogin.classList.add(INPUT_CORRECT);

    const data = {
      email: email.value,
      password: password.value,
    };

    this.eventBus.emit("attemptLogin", data);
  }
}
export default LoginView;
