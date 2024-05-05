import BaseModel from "../../MVC/BaseModel.js";
import { AuthService } from "../../modules/services.js";
import UserState from "../UserState.js";
import CSRFProtection from "../CSRFProtection.js";

/**
 * LoginModel - класс для обработки данных, общения с бэком.
 */
class LoginModel extends BaseModel {
  /**
   * Конструктор класса LoginModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {WScoket} webSocket - Текущий сокет
   */
  constructor(eventBus, webSocket, router) {
    super(eventBus);
    this.webSocket = webSocket;
    this.router = router;

    this.eventBus.addEventListener(
      "attemptLogin",
      this.checkAndSubmitForm.bind(this),
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
      this.router.redirect("/feed");
      return;
    }

    this.eventBus.emit("unauthorizedResult", {});
  }

  /**
   * Проверяет валидность формы:
   * - Проверяет валидность почты
   * - Проверяет валидность пароля
   * @returns {Promise<void>}
   */
  async checkAndSubmitForm({ email, password }) {
    const authService = new AuthService();
    const result = await authService.login(email, password);

    switch (result.status) {
      case 200:
        await CSRFProtection.updateCSRFToken();
        if (await UserState.updateState()) {
          this.webSocket.openWebSocket();
          this.eventBus.emit("receiveLoginResult", true);
        } else {
          this.eventBus.emit("receiveLoginResult", false);
        }
        break;
      case 401:
        this.eventBus.emit("receiveLoginResult", false);
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default LoginModel;
