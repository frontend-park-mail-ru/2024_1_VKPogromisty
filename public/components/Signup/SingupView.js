import {
  validateEmail,
  validatePassword,
  validateDateOfBirth,
  validateName,
} from "/public/modules/validators.js";
import { errors } from "/public/modules/errors.js";
import BaseView from "../../MVC/BaseView.js";
import "./signup.scss";

const MBToByte = 1024 * 1024;
const maxMB = 5;
const correct = "form__input_correct";
const validExtensions = ["webp", "jpg", "jpeg", "png", "bmp", "gif"];
const incorrectType = "Недопустимый тип файла";
const exceededSize = `Максимальный размер файла ${maxMB}Мб`;
const main_inputs = [
  {
    inscription: "Фамилия",
    incorrect: "incorrect-last-name",
    incorrectText: errors.incorrectName,
    id: "last-name",
    type: "text",
    name: "last_name",
    placeholder: "Фамилия",
    isPassword: false,
  },
  {
    inscription: "Имя",
    incorrect: "incorrect-first-name",
    incorrectText: errors.incorrectName,
    id: "first-name",
    type: "text",
    name: "first_name",
    placeholder: "Имя",
    isPassword: false,
  },
  {
    inscription: "Почта",
    incorrect: "incorrect-email",
    incorrectText: errors.incorrectEmail,
    id: "email",
    type: "email",
    name: "email",
    placeholder: "Почта",
    isPassword: false,
  },
  {
    inscription: "Пароль",
    incorrect: "incorrect-password",
    incorrectText: errors.incorrectPasswordLength,
    id: "password",
    type: "password",
    name: "password",
    placeholder: "Пароль",
    isPassword: true,
  },
  {
    inscription: "Повторите пароль",
    incorrect: "incorrect-repeat-password",
    incorrectText: errors.passwordMismatch,
    id: "repeat-password",
    type: "password",
    name: "repeat_password",
    placeholder: "Повторите пароль",
    isPassword: true,
  },
];

/**
 * SignupView - класс для работы с визуалом на странице.
 * @property {EventBus} eventBus - EventBus - класс управления event и обработчиков.
 */
class SignupView extends BaseView {
  /**
   * Конструктор класса SignupView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.eventBus.addEventListener(
      "receiveSignupResult",
      this.handleSignupResult.bind(this),
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
   * Renders sign up form
   *
   * @return {void}
   */
  render() {
    const template = require("./signup.hbs");
    document.body.innerHTML = template({ main_inputs });

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const repeatPassword = document.getElementById("repeat-password");
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const dateOfBirth = document.getElementById("date-birthday");
    const avatar = document.getElementById("avatar");
    const incorrectAvatar = document.getElementById("incorrect-avatar");
    const signupShowPassword = document.getElementById("signup-show-password");
    const signupShowRepeatPassword = document.getElementById(
      "signup-show-repeat-password",
    );

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
      incorrectEmail.classList.add(correct);

      if (!validateEmail(email.value.trim())) {
        incorrectEmail.classList.remove(correct);
      }
    });

    password.addEventListener("focusout", () => {
      incorrectPassword.classList.add(correct);

      if (!validatePassword(password.value)) {
        incorrectPassword.classList.remove(correct);
      }

      if (!(password.value === repeatPassword.value)) {
        incorrectRepeatPassword.classList.remove(correct);
      }
    });

    repeatPassword.addEventListener("focusout", () => {
      incorrectRepeatPassword.classList.add(correct);

      if (!(password.value === repeatPassword.value)) {
        incorrectRepeatPassword.classList.remove(correct);
      }
    });

    firstName.addEventListener("focusout", () => {
      incorrectFirstName.classList.add(correct);

      if (!validateName(firstName.value.trim())) {
        incorrectFirstName.classList.remove(correct);
      }
    });

    lastName.addEventListener("focusout", () => {
      incorrectLastName.classList.add(correct);

      if (!validateName(lastName.value.trim())) {
        incorrectLastName.classList.remove(correct);
      }
    });

    dateOfBirth.addEventListener("focusout", () => {
      incorrectDateOfBirthday.classList.add(correct);

      if (!validateDateOfBirth(dateOfBirth.value)) {
        incorrectDateOfBirthday.classList.remove(correct);
      }
    });

    signupShowPassword.addEventListener("click", () => {
      if (password.getAttribute("type") == "password") {
        password.setAttribute("type", "text");
      } else {
        password.setAttribute("type", "password");
      }
    });

    signupShowRepeatPassword.addEventListener("click", () => {
      if (repeatPassword.getAttribute("type") == "password") {
        repeatPassword.setAttribute("type", "text");
      } else {
        repeatPassword.setAttribute("type", "password");
      }
    });

    avatar.addEventListener("change", () => {
      incorrectAvatar.classList.add(correct);

      const file = avatar.files[0];
      const img = URL.createObjectURL(file);

      const typeFile = (() => {
        const parts = file.name.split(".");
        return parts[parts.length - 1];
      })();

      if (!validExtensions.includes(typeFile)) {
        incorrectAvatar.innerHTML = incorrectType;
        incorrectAvatar.classList.remove(correct);
        avatar.files = null;
        document
          .getElementById("prewatch")
          .setAttribute("src", "dist/images/user.webp");
      } else {
        if (file.size / MBToByte > maxMB) {
          incorrectAvatar.innerHTML = exceededSize;
          incorrectAvatar.classList.remove(correct);
          avatar.files = null;
          document
            .getElementById("prewatch")
            .setAttribute("src", "dist/images/user.webp");
        } else {
          document.getElementById("prewatch").setAttribute("src", img);
        }
      }
    });

    document.getElementById("button-sign-up").addEventListener("click", () => {
      this.isValidForm();
    });
  }

  /**
   * Перенаправление на новости при успешной регистрации
   *
   * @param {boolean} result - Результат регистрации
   * @return {void}
   */
  handleSignupResult(result) {
    const repeatEmail = document.getElementById("repeat-email");

    if (result) {
      document.body.innerHTML = "";
      this.router.redirect("/feed/news");
    } else {
      repeatEmail.classList.remove(correct);
    }
  }

  /**
   * При ошибке сервера показ соответствующего сообщения
   *
   * @return {void}
   */
  handleServerError() {
    document.getElementById("server-error").classList.remove(correct);
  }

  /**
   * Проверка на корректность формы при её отправлении
   *
   * @return {void}
   */
  isValidForm() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const repeatPassword = document.getElementById("repeat-password");
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const dateOfBirth = document.getElementById("date-birthday");
    const avatar = document.getElementById("avatar");
    const incorrectAvatar = document.getElementById("incorrect-avatar");
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

    incorrectEmail.classList.add(correct);
    incorrectRepeatPassword.classList.add(correct);
    incorrectPassword.classList.add(correct);
    incorrectFirstName.classList.add(correct);
    incorrectLastName.classList.add(correct);
    incorrectDateOfBirthday.classList.add(correct);
    incorrectAvatar.classList.add(correct);

    let flag = true;

    if (!validateEmail(email.value)) {
      incorrectEmail.classList.remove(correct);
      flag = false;
    }

    if (password.value != repeatPassword.value) {
      incorrectRepeatPassword.classList.remove(correct);
      flag = false;
    }

    if (!validatePassword(password.value)) {
      incorrectPassword.classList.remove(correct);
      flag = false;
    }

    if (!validateName(firstName.value)) {
      incorrectFirstName.classList.remove(correct);
      flag = false;
    }

    if (!validateName(lastName.value)) {
      incorrectLastName.classList.remove(correct);
      flag = false;
    }

    if (!validateDateOfBirth(dateOfBirth.value)) {
      incorrectDateOfBirthday.classList.remove(correct);
      flag = false;
    }

    const file = avatar.files[0];

    if (file) {
      const typeFile = (() => {
        const parts = file.name.split(".");
        return parts[parts.length - 1];
      })();

      if (!validExtensions.includes(typeFile)) {
        incorrectAvatar.innerHTML = incorrectType;
        incorrectAvatar.classList.remove(correct);
        flag = false;
      }

      if (file.size / MBToByte > maxMB) {
        incorrectAvatar.innerHTML = exceededSize;
        incorrectAvatar.classList.remove(correct);
        flag = false;
      }
    }

    if (!flag) {
      return false;
    }

    repeatEmail.classList.add("correct");

    const data = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      repeatPassword: repeatPassword.value,
      dateOfBirth: dateOfBirth.value,
      avatar: avatar.files[0],
    };

    this.eventBus.emit("attemptSignup", data);
  }
}

export default SignupView;
