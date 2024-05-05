import { AuthService } from "../../modules/services.js";
import BaseModel from "/public/MVC/BaseModel.js";
import UserState from "../UserState.js";
import CSRFProtection from "../CSRFProtection.js";

/**
 * SignupModel - класс для обработки данных, общения с бэком.
 */
class SignupModel extends BaseModel {
  /**
   * Конструктор класса SignupModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {WSocket} webSocket - Текущий сокет
   */
  constructor(eventBus, webSocket, router) {
    super(eventBus);

    this.webSocket = webSocket;
    this.router = router;

    this.eventBus.addEventListener(
      "attemptSignup",
      this.isValidForm.bind(this),
    );
  }

  /**
   * Checks if user logined
   *
   * @returns {Promise<void>}
   */
  async checkIfLogin() {
    const result = await CSRFProtection.updateCSRFToken();

    if (result) {
      await UserState.updateState();
      this.webSocket.openWebSocket();
      this.router.redirect("/feed/news");
      return;
    }

    this.eventBus.emit("unauthorizedResult", {});
  }

  /**
   * Checks if the form is valid:
   * - Checks if the email is valid
   * - Checks if the password is valid
   * - Checks if the repeated password is the same as the password
   * - Checks if the first name is valid
   * - Checks if the last name is valid
   * - Checks if the date of birth is valid
   * @returns {Promise<void>}
   */
  async isValidForm({
    firstName,
    lastName,
    email,
    password,
    repeatPassword,
    dateOfBirth,
    avatar,
  }) {
    const authService = new AuthService();

    const result = await authService.sign_up(
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
      dateOfBirth,
      avatar,
    );

    switch (result.status) {
      case 201:
        await CSRFProtection.updateCSRFToken();
        if (await UserState.updateState()) {
          this.webSocket.openWebSocket();
          this.eventBus.emit("receiveSignupResult", true);
        } else {
          this.eventBus.emit("receiveSignupResult", false);
        }
        break;
      case 400:
        this.eventBus.emit("receiveSignupResult", false);
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default SignupModel;
