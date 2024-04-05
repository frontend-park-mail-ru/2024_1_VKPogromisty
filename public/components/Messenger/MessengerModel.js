import { AuthService, ChatService } from "../../modules/services.js";
import BaseModel from "./public/MVC/BaseModel.js";

/**
 * MessengerModel - класс для обработки данных, общения с бэком.
 */
class MessengerModel extends BaseModel {
  /**
   * Конструктор класса MessengerModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.chatService = new ChatService();
    this.authService = new AuthService();

    this.eventBus.addEventListener(
      "readyRenderDialogs",
      this.getDialogs.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedLogoutButton",
      this.logout.bind(this),
    );
  }

  /**
   * Gets dialogs of session's user
   */
  async getDialogs() {
    const result = await this.chatService.getDialogs();

    switch (result.status) {
      case 200:
        this.eventBus.emit("getDialogsSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Logouts from account
   * @return {void}
   */
  async logout() {
    const result = await this.authService.logout();

    switch (result.status) {
      case 200:
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default MessengerModel;
