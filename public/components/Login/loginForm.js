import { validateEmail, validatePassword } from "/public/modules/validators.js";
import { errors } from "/public/modules/errors.js";
import { AuthService } from "../../modules/services.js";

const authService = new AuthService();

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
 * Class for rendering the login form
 * @class
 * @property {HTMLElement} #parent - The parent element
 * @method renderForm - Renders the login form
 * @method isValidForm - Checks if the form is valid
 */
export class LoginForm {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Renders the login form from handlebars template, adds event listeners to the inputs:
   * - Checks if the email is valid
   * - Checks if the password is valid
   * @returns {void}
   */
  renderForm() {
    const template = Handlebars.templates["login.hbs"];
    this.#parent.innerHTML = template({ inputs });
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const incorrectEmail = document.getElementById("incorrect-email");
    const incorrectPassword = document.getElementById("incorrect-password");
    const loginShowPassword = document.getElementById("login-show-password");

    email.addEventListener("focusout", () => {
      incorrectEmail.classList.remove('correct');

      if (validateEmail(email.value)) {
        incorrectEmail.classList.add('correct')
      }
    });

    password.addEventListener("focusout", () => {
      incorrectPassword.classList.remove('correct');

      if (validatePassword(password.value)) {
        incorrectPassword.classList.add('correct');
      }
    });

    loginShowPassword.addEventListener('click', () => {
      if (password.getAttribute('type') == 'password') {
        password.setAttribute('type', 'text');
      } else {
        password.setAttribute('type', 'password');
      }
    });

  }

  /**
   * Checks if the form is valid:
   * - Checks if the email is valid
   * - Checks if the password is valid
   * @returns {Promise<boolean>}
   */
  async isValidForm() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const incorrectEmail = document.getElementById("incorrect-email");
    const incorrectPassword = document.getElementById("incorrect-password");
    const incorrectFormLogin = document.getElementById('incorrect-form-login');

    incorrectEmail.classList.add('correct');
    incorrectPassword.classList.add('correct');

    let flag = true;

    if (!validateEmail(email.value)) {
      incorrectEmail.classList.remove('correct');
      flag = false;
    }
    if (!validatePassword(password.value)) {
      incorrectPassword.classList.remove('correct');
      flag = false;
    }

    if (!flag) {
      return false;
    }

    incorrectFormLogin.classList.add('correct');

    const result = await authService.login(email.value, password.value);

    if (result.ok) {
      const { avatar, firstName, lastName } = result.body.user;
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      return true;
    } else {
      incorrectFormLogin.classList.remove('correct');
      return false;
    }
  }
}
