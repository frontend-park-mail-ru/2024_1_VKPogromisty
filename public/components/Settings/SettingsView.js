import {
  validateEmail,
  validatePassword,
  validateName,
} from "/public/modules/validators.js";
import BaseView from "../../MVC/BaseView.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "../../modules/consts.js";
import UserState from "../UserState.js";
import "./settings.scss";
import { customConfirm } from "../../modules/windows.js";

const correct = "form__input_correct";
const validExtensions = ["webp", "jpg", "jpeg", "png", "bmp", "gif"];
const staticUrl = `${API_URL}/static`;

/**
 * SettingsView - класс для работы с визуалом на странице.
 * @property {EventBus} eventBus - EventBus - класс управления event и обработчиков.
 */
class SettingsView extends BaseView {
  /**
   * Конструктор класса SettingsView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Current router
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;

    this.eventBus.addEventListener(
      "changesSaved",
      this.changeSuccess.bind(this),
    );
    this.eventBus.addEventListener(
      "doubledEmail",
      this.doubledEmail.bind(this),
    );
    this.eventBus.addEventListener(
      "serverError",
      this.handleServerError.bind(this),
    );
  }

  /**
   * Renders main part of page
   */
  renderSettingsMain() {
    const { userId, avatar, firstName, lastName, email } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    const template = require("./settingsMain.hbs");
    this.mainElement = document.getElementById("activity");

    this.mainElement.innerHTML = template({
      lastName,
      firstName,
      avatar,
      email,
      staticUrl,
    });

    const emailForm = document.getElementById("email");
    const password = document.getElementById("password");
    const repeatPassword = document.getElementById("repeat-password");
    const firstNameForm = document.getElementById("first-name");
    const lastNameForm = document.getElementById("last-name");
    const avatarForm = document.getElementById("avatar");
    const incorrectAvatarForm = document.getElementById("incorrect-avatar");
    const incorrectEmail = document.getElementById("incorrect-email");
    const incorrectPassword = document.getElementById("incorrect-password");
    const incorrectRepeatPassword = document.getElementById(
      "incorrect-repeat-password",
    );
    const incorrectFirstName = document.getElementById("incorrect-first-name");
    const incorrectLastName = document.getElementById("incorrect-last-name");
    const cancelButton = document.getElementById("cancel-setting");

    emailForm.addEventListener("focusout", () => {
      incorrectEmail.classList.add(correct);

      if (!validateEmail(emailForm.value.trim())) {
        incorrectEmail.classList.remove(correct);
      }
    });

    password.addEventListener("focusout", () => {
      incorrectPassword.classList.add(correct);

      if (!validatePassword(password.value) && password.value !== "") {
        incorrectPassword.classList.remove(correct);
      }

      if (!(password.value === repeatPassword.value) && password.value !== "") {
        incorrectRepeatPassword.classList.remove(correct);
      }
    });

    repeatPassword.addEventListener("focusout", () => {
      incorrectRepeatPassword.classList.add(correct);

      if (!(password.value === repeatPassword.value)) {
        incorrectRepeatPassword.classList.remove(correct);
      }
    });

    firstNameForm.addEventListener("focusout", () => {
      incorrectFirstName.classList.add(correct);

      if (!validateName(firstNameForm.value.trim())) {
        incorrectFirstName.classList.remove(correct);
      }
    });

    lastNameForm.addEventListener("focusout", () => {
      incorrectLastName.classList.add(correct);

      if (!validateName(lastNameForm.value.trim())) {
        incorrectLastName.classList.remove(correct);
      }
    });

    cancelButton.addEventListener("click", () => {
      repeatPassword.value = "";
      password.value = "";
      firstNameForm.value = firstName;
      lastNameForm.value = lastName;
      emailForm.value = email;
      document
        .getElementById("prewatch")
        .setAttribute("src", `${staticUrl}/user-avatars/${avatar}`);
      incorrectEmail.classList.add(correct);
      incorrectRepeatPassword.classList.add(correct);
      incorrectPassword.classList.add(correct);
      incorrectFirstName.classList.add(correct);
      incorrectLastName.classList.add(correct);
      incorrectAvatarForm.classList.add(correct);
    });

    avatarForm.addEventListener("change", () => {
      incorrectAvatarForm.classList.add(correct);

      const file = avatarForm.files[0];
      const img = URL.createObjectURL(file);

      const typeFile = (() => {
        const parts = file.name.split(".");
        return parts[parts.length - 1];
      })();

      if (!validExtensions.includes(typeFile)) {
        incorrectAvatarForm.classList.remove(correct);
        avatarForm.files = null;
      } else {
        document.getElementById("prewatch").setAttribute("src", img);
      }
    });

    document.getElementById("accept-setting").addEventListener("click", () => {
      this.isValidForm();
    });

    document.getElementById("delete-setting").addEventListener("click", () => {
      customConfirm(
        (() => {
          this.eventBus.emit("clickedDeleteProfile", {});
        }).bind(this),
        "Удалить аккаунт?",
        "Вы уверены, что хотите удалить аккаунт?",
        "Удалить",
        "Отмена",
      );
    });

    document.getElementById("logout-button").addEventListener("click", () => {
      customConfirm(
        (() => {
          this.eventBus.emit("clickedLogoutButton", {});
        }).bind(this),
        "Выход",
        "Вы уверены, что хотите выйти из аккаунта?",
        "Да",
        "Нет",
      );
    });
  }

  /**
   * При ошибке сервера показ соответствующего сообщения
   *
   * @return {void}
   */
  handleServerError() {
    document
      .getElementById("server-error-500")
      .classList.remove("server-error-500");
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
    const avatar = document.getElementById("avatar");
    const incorrectAvatarForm = document.getElementById("incorrect-avatar");
    const incorrectEmail = document.getElementById("incorrect-email");
    const incorrectPassword = document.getElementById("incorrect-password");
    const incorrectRepeatPassword = document.getElementById(
      "incorrect-repeat-password",
    );
    const incorrectFirstName = document.getElementById("incorrect-first-name");
    const incorrectLastName = document.getElementById("incorrect-last-name");
    const repeatEmail = document.getElementById("repeat-email");

    incorrectEmail.classList.add(correct);
    incorrectRepeatPassword.classList.add(correct);
    incorrectPassword.classList.add(correct);
    incorrectFirstName.classList.add(correct);
    incorrectLastName.classList.add(correct);
    incorrectAvatarForm.classList.add(correct);

    let flag = true;

    if (!validateEmail(email.value.trim())) {
      incorrectEmail.classList.remove(correct);
      flag = false;
    }

    if (password.value != repeatPassword.value) {
      incorrectRepeatPassword.classList.remove(correct);
      flag = false;
    }

    if (!validatePassword(password.value) && password.value !== "") {
      incorrectPassword.classList.remove(correct);
      flag = false;
    }

    if (!validateName(firstName.value.trim())) {
      incorrectFirstName.classList.remove(correct);
      flag = false;
    }

    if (!validateName(lastName.value.trim())) {
      incorrectLastName.classList.remove(correct);
      flag = false;
    }

    const file = avatar.files[0];

    if (file) {
      const typeFile = (() => {
        const parts = file.name.split(".");
        return parts[parts.length - 1];
      })();

      if (!validExtensions.includes(typeFile)) {
        incorrectAvatarForm.classList.remove(correct);
        flag = false;
      }
    }

    if (!flag) {
      return false;
    }

    repeatEmail.classList.add("correct");

    this.eventBus.emit("clickedSaveChanges", {
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value,
      repeatPassword: repeatPassword.value,
      email: email.value,
      avatar: avatar.files[0],
    });
  }

  /**
   * Changes avatar of header in success case
   */
  changeSuccess() {
    const img = document.getElementById("user__avatar-img");
    img.setAttribute("src", `${staticUrl}/${UserState.avatar}`);

    const fullHeaderName = document.getElementById("user__username-span");
    fullHeaderName.innerHTML = `${UserState.firstName} ${UserState.lastName}`;

    this.router.redirect(`/profile/${UserState.userId}`);
  }

  /**
   * Shows alert in doubled email case
   */
  doubledEmail() {
    document.getElementById("repeat-email").classList.remove(correct);
  }
}

export default SettingsView;
