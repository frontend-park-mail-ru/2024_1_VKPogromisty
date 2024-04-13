import {
  AuthService,
  ChatService,
  ProfileService,
} from "../../modules/services.js";
import BaseModel from "./public/MVC/BaseModel.js";
import { customAlert } from "../../modules/windows.js";

/**
 * MessengerModel - класс для обработки данных, общения с бэком.
 */
class MessengerModel extends BaseModel {
  /**
   * Конструктор класса MessengerModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   * @param {WSocket} webSocket - Текущий сокет
   */
  constructor(eventBus, router, webSocket) {
    super(eventBus);

    this.router = router;
    this.webSocket = webSocket;
    this.chatService = new ChatService();
    this.authService = new AuthService();
    this.profileService = new ProfileService();

    this.eventBus.addEventListener(
      "needUpgradeWebSocket",
      this.updateWebSocket.bind(this),
    );
    this.eventBus.addEventListener(
      "needGetProfile",
      this.getProfileData.bind(this),
    );
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
   * Add events to WebSocket
   */
  updateWebSocket() {
    this.webSocket.addEventOnMessage("messengerMessage", (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "SEND_MESSAGE":
          this.eventBus.emit("sendMessageSuccess", data.payload);
          break;
        case "UPDATE_MESSAGE":
          this.eventBus.emit("updateLastMessage", data.payload);
          break;
        case "DELETE_MESSAGE":
          customAlert("error");
          break;
        default:
          this.eventBus.emit("serverError", {});
      }
    });

    this.webSocket.addEventOnError("messageError", () => {
      customAlert();
    });

    this.webSocket.addEventOnClose("messageClose", () => {
      this.eventBus.emit("serverError", {});
    });

    this.eventBus.emit("updatedWebSocket", {});
  }

  /**
   * Gets the data of user current profile
   * @param {number} userId - The ID of user current profile
   * @return {void}
   */
  async getProfileData(userId) {
    const resultProfileMain =
      await this.profileService.getOtherProfileData(userId);

    switch (resultProfileMain.status) {
      case 200:
        this.eventBus.emit("receiveProfileData", resultProfileMain.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        customAlert();
    }
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
