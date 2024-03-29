import {
  validateEmail,
  validatePassword,
  validateDateOfBirth,
  validateName,
} from "/public/modules/validators.js";
import { errors } from "/public/modules/errors.js";
import { AuthService } from "../../modules/services.js";

const authService = new AuthService();

const main_inputs = [
  {
    inscription: "Фамилия",
    incorrect: "incorrect-last-name",
    id: "last-name",
    type: "text",
    name: "last_name",
    placeholder: "Фамилия",
  },
  {
    inscription: "Имя",
    incorrect: "incorrect-first-name",
    id: "first-name",
    type: "text",
    name: "first_name",
    placeholder: "Имя",
  },
  {
    inscription: "Почта",
    incorrect: "incorrect-email",
    id: "email",
    type: "email",
    name: "email",
    placeholder: "Почта",
  },
  {
    inscription: "Пароль",
    incorrect: "incorrect-password",
    id: "password",
    type: "password",
    name: "password",
    placeholder: "Пароль",
  },
  {
    inscription: "Повторите пароль",
    incorrect: "incorrect-repeat-password",
    id: "repeat-password",
    type: "password",
    name: "repeat_password",
    placeholder: "Повторите пароль",
  },
];

const part_of_date = [
  {
    id: "day",
    placeholder: "ДД",
  },
  {
    id: "month",
    placeholder: "ММ",
  },
  {
    id: "year",
    placeholder: "ГГГГ",
  },
];

/**
 * Class for rendering the sign up form
 * @class
 * @property {HTMLElement} #parent - The parent element
 * @method renderForm - Renders the sign up form
 * @method isValidForm - Checks if the form is valid
 */
export class SignUpForm {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Renders the sign up form from handlebars template, adds event listeners to the inputs:
   * - Checks if the email is valid
   * - Checks if the password is valid
   * - Checks if the repeated password is the same as the password
   * - Checks if the first name is valid
   * - Checks if the last name is valid
   * - Checks if the date of birth is valid
   * @returns {void}
   */
  renderForm() {
    const template = Handlebars.templates["signup.hbs"];
    this.#parent.innerHTML = template({ main_inputs, part_of_date });

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const repeatPassword = document.getElementById("repeat-password");
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const day = document.getElementById("day");
    const month = document.getElementById("month");
    const year = document.getElementById("year");

    const incorrectEmail = document.getElementById("incorrect-email");
    const incorrectPassword = document.getElementById("incorrect-password");
    const incorrectRepeatPassword = document.getElementById(
      "incorrect-repeat-password",
    );
    const incorrectFirstName = document.getElementById("incorrect-first-name");
    const incorrectLastName = document.getElementById("incorrect-last-name");
    const incorrectDateOfBirthday = document.getElementById(
      "incorrect-date-of-birthday",
    );

    email.addEventListener("focusout", () => {
      incorrectEmail.innerHTML = "";

      if (!validateEmail(email.value)) {
        incorrectEmail.innerHTML = errors.incorrectEmail;
      }
    });

    password.addEventListener("focusout", () => {
      incorrectPassword.innerHTML = "";

      if (!validatePassword(password.value)) {
        incorrectPassword.innerHTML = errors.incorrectPasswordLength;
      }
    });

    repeatPassword.addEventListener("focusout", () => {
      incorrectRepeatPassword.innerHTML = "";

      if (password.value != repeatPassword.value) {
        incorrectRepeatPassword.innerHTML = errors.passwordMismatch;
      }
    });

    firstName.addEventListener("focusout", () => {
      incorrectFirstName.innerHTML = "";

      if (!validateName(firstName.value)) {
        incorrectFirstName.innerHTML = errors.incorrectName;
      }
    });

    lastName.addEventListener("focusout", () => {
      incorrectLastName.innerHTML = "";

      if (!validateName(lastName.value)) {
        incorrectLastName.innerHTML = errors.incorrectName;
      }
    });

    year.addEventListener("focusout", () => {
      incorrectDateOfBirthday.innerHTML = "";

      if (!validateDateOfBirth(day.value, month.value, year.value)) {
        incorrectDateOfBirthday.innerHTML = errors.impossibleDate;
      }
    });
  }

  /**
   * Checks if the form is valid:
   * - Checks if the email is valid
   * - Checks if the password is valid
   * - Checks if the repeated password is the same as the password
   * - Checks if the first name is valid
   * - Checks if the last name is valid
   * - Checks if the date of birth is valid
   * @returns {Promise<boolean>}
   */
  async isValidForm() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const repeatPassword = document.getElementById("repeat-password");
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const day = document.getElementById("day");
    const month = document.getElementById("month");
    const year = document.getElementById("year");
    const avatar = document.getElementById("avatar");
    const incorrectEmail = document.getElementById("incorrect-email");
    const incorrectPassword = document.getElementById("incorrect-password");
    const incorrectRepeatPassword = document.getElementById(
      "incorrect-repeat-password",
    );
    const incorrectFirstName = document.getElementById("incorrect-first-name");
    const incorrectLastName = document.getElementById("incorrect-last-name");
    const incorrectDateOfBirthday = document.getElementById(
      "incorrect-date-of-birthday",
    );
    const repeatEmail = document.getElementById("repeat-email");

    function clearIncorrects() {
      incorrectEmail.innerHTML = "";
      incorrectRepeatPassword.innerHTML = "";
      incorrectPassword.innerHTML = "";
      incorrectFirstName.innerHTML = "";
      incorrectLastName.innerHTML = "";
      incorrectDateOfBirthday.innerHTML = "";
    }

    clearIncorrects();

    let flag = true;

    if (!validateEmail(email.value)) {
      incorrectEmail.innerHTML = errors.incorrectEmail;
      flag = false;
    }

    if (password.value != repeatPassword.value) {
      incorrectRepeatPassword.innerHTML = errors.passwordMismatch;
      flag = false;
    }

    if (!validatePassword(password.value)) {
      incorrectPassword.innerHTML = errors.incorrectPasswordLength;
      flag = false;
    }

    if (!validateName(firstName.value)) {
      incorrectFirstName.innerHTML = errors.incorrectName;
      flag = false;
    }

    if (!validateName(lastName.value)) {
      incorrectLastName.innerHTML = errors.incorrectName;
      flag = false;
    }

    if (!validateDateOfBirth(day.value, month.value, year.value)) {
      incorrectDateOfBirthday.innerHTML = errors.impossibleDate;
      flag = false;
    }

    if (!flag) {
      return false;
    }

    const dateOfBirth = `${year.value}-${month.value.padStart(2, "0")}-${day.value.padStart(2, "0")}`;

    const result = await authService.sign_up(
      firstName.value,
      lastName.value,
      email.value,
      password.value,
      repeatPassword.value,
      dateOfBirth,
      avatar.files[0],
    );

    if (result.ok) {
      const { avatar, firstName, lastName } = result.body.user;
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      return true;
    } else {
      repeatEmail.innerHTML = "Почта уже используется";
      return false;
    }
  }
}
