import { validateEmail, validatePassword } from "/public/modules/validators.js";
import { errors } from "/public/modules/errors.js";
import { AuthService } from "../../modules/services.js";

const authService = new AuthService();

const inputs = [
  {
    incorrect: "incorrect-email",
    type: "text",
    id: "email",
    name: "email",
    placeholder: "Email",
  },
  {
    incorrect: "incorrect-password",
    type: "password",
    id: "password",
    name: "password",
    placeholder: "Password",
  },
];

export class LoginForm {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  renderForm() {
    const template = Handlebars.templates["login.hbs"];
    this.#parent.innerHTML = template({ inputs });
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const incorrectEmail = document.getElementById("incorrect-email");
    const incorrectPassword = document.getElementById("incorrect-password");

    function clearIncorrects() {
      incorrectEmail.innerHTML = "";
      incorrectPassword.innerHTML = "";
    }

    email.addEventListener("focusout", () => {
      email.innerHTML = "";

      if (!validateEmail(email.value)) {
        incorrectEmail.innerHTML = errors.incorrectEmail;
      }
    });

    password.addEventListener("focusout", () => {
      password.innerHTML = "";

      if (!validatePassword(password.value)) {
        incorrectPassword.innerHTML = errors.incorrectPasswordLength;
      }
    });

    document
      .getElementById("button-sign-in")
      .addEventListener("click", async () => {
        clearIncorrects();

        let flag = true;

        if (!validateEmail(email.value)) {
          incorrectEmail.innerHTML = errors.incorrectEmail;
          flag = false;
        }
        if (!validatePassword(password.value)) {
          incorrectPassword.innerHTML = errors.incorrectPasswordLength;
          flag = false;
        }

        if (!flag) {
          return;
        }

        const result = await authService.login(email.value, password.value);

        if (result.ok) {
          const { avatar, firstName, lastName } = result.body.user;
          localStorage.setItem("avatar", avatar);
          localStorage.setItem("firstName", firstName);
          localStorage.setItem("lastName", lastName);
          window.location.replace("/feed");
        } else {
          incorrectEmail.innerHTML = "Некорректные данные";
          return;
        }
      });

    document.getElementById("button-sign-up").addEventListener("click", () => {
      window.location.replace("/sign_up");
    });
  }
}
