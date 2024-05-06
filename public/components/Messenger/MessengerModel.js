import {
  AuthService,
  ChatService,
  ProfileService,
} from "../../modules/services.js";
import BaseModel from "../../MVC/BaseModel.js";
import { customAlert } from "../../modules/windows.js";

/**
 * A LastMessages structure
 *
 * @typedef {Object} LastMessages
 * @property {number} companionId - The ID of current companion
 * @property {number} lastMessageId - The ID of last message in conversation with current companion
 * @property {number} messagesAmount - The amount of last messages
 */

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
      "needGetProfile",
      this.getProfileData.bind(this),
    );
    this.eventBus.addEventListener(
      "needLastMessageDialog",
      this.getLastMessageDialog.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderDialogs",
      this.getDialogs.bind(this),
    );

    this.addWebSocketHandlers();
  }

  /**
   * Add events to WebSocket
   */
  addWebSocketHandlers() {
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
          this.eventBus.emit("deleteLastMessage", data.payload);
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
   * Gets last messages in conversation with current companion
   *
   * @param {LastMessages} lastMessages - The last messages in conversation with current companion
   */
  async getLastMessageDialog({ companionId, lastMessageId, messagesAmount }) {
    const result = await this.chatService.getMessages(
      companionId,
      lastMessageId,
      messagesAmount,
    );

    switch (result.status) {
      case 200:
        this.eventBus.emit("getLastMessageSuccess", {
          messages: result.body,
          companionId,
        });
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default MessengerModel;
