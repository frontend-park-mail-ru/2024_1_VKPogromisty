import {
  AuthService,
  ChatService,
  ProfileService,
} from "../../modules/services.js";
import BaseModel from "./public/MVC/BaseModel.js";
import { API_URL, WEBSOCKET_URL } from "/public/modules/consts.js";

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
    this.profileService = new ProfileService();
    this.authService = new AuthService();

    this.eventBus.addEventListener(
      "readyRenderCompanion",
      this.getCompanion.bind(this),
    );
    this.eventBus.addEventListener(
      "needOpenWebSocket",
      this.openWebSocket.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderMessages",
      this.getMessages.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedSendMessage",
      this.sendMessage.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedDeleteMessage",
      this.deleteMessage.bind(this),
    );
    this.eventBus.addEventListener("clickLogoutButton", this.logout.bind(this));
  }

  async getCompanion(companionId) {
    const result = await this.profileService.getOtherProfileData(companionId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("receiveCompanionData", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  openWebSocket() {
    this.ws = new WebSocket(WEBSOCKET_URL);

    this.ws.onopen = () => {
      this.eventBus.emit("openedWebSocket", {});
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "SEND_MESSAGE":
          this.eventBus.emit("sendMessageSuccess", data.payload);
          break;
        case "UPDATE_MESSAGE":
          this.eventBus.emit("updateMessageSuccess", data.payload);
          break;
        case "DELETE_MESSAGE":
          this.eventBus.emit("deleteMessageSuccess", data.payload);
          break;
        default:
          this.eventBus.emit("serverError", {});
      }
    };

    this.ws.onerror = () => {
      this.eventBus.emit("serverError", {});
    };
  }

  async getMessages({ companionId, lastMessage }) {
    const result = await this.chatService.getMessages(companionId, lastMessage);

    switch (result.status) {
      case 200:
        this.eventBus.emit("getMessagesSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async sendMessage({ companionId, textContent }) {
    this.ws.send(
      JSON.stringify({
        type: "SEND_MESSAGE",
        receiver: +companionId,
        payload: { content: textContent },
      }),
    );
  }

  async deleteMessage(messageId) {
    this.ws.send(
      JSON.stringify({
        type: "DELETE_MESSAGE",
        payload: { messageId: +messageId },
      }),
    );
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
