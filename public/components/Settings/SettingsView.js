import {
  validateEmail,
  validatePassword,
  validateName,
} from "/public/modules/validators.js";
import BaseView from "../../MVC/BaseView.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "../../modules/consts.js";

const correct = "form__input__correct";

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
   * @param {UserState} userState - The current info about user
   */
  constructor(eventBus, router, userState) {
    super(eventBus);

    this.router = router;
    this.userState = userState;

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
   * Рендер внутри переданного HTML элемента.
   * Переопределение в наследниках.
   *
   * @return {void}
   */
  renderSettingsMain() {
    const { userId, avatar, firstName, lastName, email } = this.userState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    const template = Handlebars.templates["settingsMain.hbs"];
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
      incorrectEmail.classList.add(correct);
      incorrectRepeatPassword.classList.add(correct);
      incorrectPassword.classList.add(correct);
      incorrectFirstName.classList.add(correct);
      incorrectLastName.classList.add(correct);
    });

    avatarForm.addEventListener("change", () => {
      const file = avatarForm.files[0];
      const img = URL.createObjectURL(file);

      document.getElementById("prewatch").setAttribute("src", img);
    });

    document.getElementById("accept-setting").addEventListener("click", () => {
      this.isValidForm();
    });

    document.getElementById("delete-setting").addEventListener("click", () => {
      this.eventBus.emit("clickedDeleteProfile", {});
    });

    document.getElementById("logout-button").addEventListener("click", () => {
      this.eventBus.emit("clickedLogoutButton", {});
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

    let flag = true;

    if (!validateEmail(email.value.trim())) {
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

    if (!validateName(firstName.value.trim())) {
      incorrectFirstName.classList.remove(correct);
      flag = false;
    }

    if (!validateName(lastName.value.trim())) {
      incorrectLastName.classList.remove(correct);
      flag = false;
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

  changeSuccess() {
    const img = document.getElementById("user__avatar-img");
    img.setAttribute("src", `${staticUrl}/${this.userState.avatar}`);

    this.router.redirect(`/profile/${this.userState.userId}`);
  }

  doubledEmail() {
    document.getElementById("repeat-email").classList.remove(correct);
  }
}

export default SettingsView;
