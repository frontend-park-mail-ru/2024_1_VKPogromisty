import BaseModel from "../../MVC/BaseModel.js";
import { AuthService } from "../../modules/services.js";

/**
 * LoginModel - класс для обработки данных, общения с бэком.
 */
class LoginModel extends BaseModel {
  /**
   * Конструктор класса LoginModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {UserState} userState - Текущее состояние юзера
   * @param {WScoket} webSocket - Текущий сокет
   */
  constructor(eventBus, userState, webSocket) {
    super(eventBus);
    this.userState = userState;
    this.webSocket = webSocket;

    this.eventBus.addEventListener(
      "attemptLogin",
      this.checkAndSubmitForm.bind(this),
    );
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
        if (await this.userState.updateState()) {
          this.webSocket.openWebSocket();
          this.eventBus.emit("receiveLoginResult", true);
          break;
        }
      case 401:
        this.eventBus.emit("receiveLoginResult", false);
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default LoginModel;
