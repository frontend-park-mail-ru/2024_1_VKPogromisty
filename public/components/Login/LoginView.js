import { validateEmail, validatePassword } from "/public/modules/validators.js";
import { errors } from "/public/modules/errors.js";
import BaseView from "../../MVC/BaseView.js";
import "./login.scss";

const INPUT_CORRECT = "form__input_correct";

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

/**
 * LoginView - класс для работы с визуалом на странице.
 * @property {EventBus} eventBus - EventBus - класс управления event и обработчиков.
 */
class LoginView extends BaseView {
  /**
   * Конструктор класса LoginView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
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
    this.eventBus.addEventListener(
      "unauthorizedResult",
      this.render.bind(this),
    );
  }

  /**
   * Renders login form
   *
   * @return {void}
   */
  render() {
    const template = require("./login.hbs");
    document.body.innerHTML = template({ inputs });

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
      .addEventListener("click", this.checkAndSubmitForm.bind(this));
  }

  /**
   * Перенаправление на новости при успешной авторизации
   *
   * @param {boolean} result - Результат логина
   * @return {void}
   */
  handleLoginResult(result) {
    const incorrectPassword = document.getElementById("incorrect-form-login");

    if (result) {
      document.body.innerHTML = "";
      this.eventBus.emit("loginSuccess", "/feed/news");
    } else {
      incorrectPassword.classList.remove(INPUT_CORRECT);
    }
  }

  /**
   * При ошибке сервера показ соответствующего сообщения
   *
   * @return {void}
   */
  handleServerError() {
    document.getElementById("server-error").classList.remove(INPUT_CORRECT);
  }

  /**
   * Проверка на корректность формы при её отправлении
   *
   * @return {void}
   */
  checkAndSubmitForm() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const incorrectEmail = document.getElementById("incorrect-email");
    const incorrectPassword = document.getElementById("incorrect-password");
    const incorrectFormLogin = document.getElementById("incorrect-form-login");

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
      return;
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
