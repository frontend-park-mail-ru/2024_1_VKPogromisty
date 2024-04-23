import {
  AuthService,
  ChatService,
  ProfileService,
} from "../../modules/services.js";
import BaseModel from "../../MVC/BaseModel.js";

/**
 * A LastMessages structure
 *
 * @typedef {Object} LastMessages
 * @property {number} companionId - The ID of current companion
 * @property {number} lastMessageId - The ID of last message in conversation with current companion
 */

/**
 * A SendMessage structure
 *
 * @typedef {Object} SendMessage
 * @property {number} companionId - The ID of current companion
 * @property {string} textContent - The text content of current message
 */

/**
 * A UpdateMessage structure
 *
 * @typedef {Object} UpdateMessage
 * @property {number} messageId - The ID of current message
 * @property {string} textContent - The text content of current message
 * @property {number} receiverId - The ID of receiver updated message
 */

/**
 * ChatModel - класс для обработки данных, общения с бэком.
 */
class ChatModel extends BaseModel {
  /**
   * Конструктор класса ChatModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   * @param {WSocket} webSocket - Действующий WebSocket
   */
  constructor(eventBus, router, webSocket) {
    super(eventBus);

    this.router = router;
    this.webSocket = webSocket;
    this.chatService = new ChatService();
    this.profileService = new ProfileService();
    this.authService = new AuthService();

    this.eventBus.addEventListener(
      "readyRenderCompanion",
      this.getCompanion.bind(this),
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
    this.eventBus.addEventListener(
      "clickedUpdateMessage",
      this.updateMessage.bind(this),
    );
    this.eventBus.addEventListener("clickLogoutButton", this.logout.bind(this));

    this.addWebSocketHandlers();
  }

  /**
   * Gets the data of current companion
   *
   * @param {number} companionId
   */
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

  /**
   * Add events to WebSocket
   */
  addWebSocketHandlers() {
    this.webSocket.addEventOnMessage("dialogMessage", (event) => {
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
    });

    this.webSocket.addEventOnError("messageError", () => {
      this.eventBus.emit("serverError", {});
    });

    this.webSocket.addEventOnClose("messageClose", () => {
      this.eventBus.emit("serverError", {});
    });
  }

  /**
   * Gets last messages in conversation with current companion
   *
   * @param {LastMessages} lastMessages - The last messages in conversation with current companion
   */
  async getMessages({ companionId, lastMessageId }) {
    const result = await this.chatService.getMessages(
      companionId,
      lastMessageId,
    );

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

  /**
   * Sends message in conversation with current companion
   *
   * @param {SendMessage} sendMessage - The sended message
   */
  async sendMessage({ companionId, textContent }) {
    this.webSocket.sendMessage(companionId, textContent);
  }

  /**
   * Updates message in conversation with current companion
   *
   * @param {UpdateMessage} UpdateMessage - The updated message
   */
  async updateMessage({ messageId, textContent, receiver }) {
    this.webSocket.updateMessage(messageId, textContent, receiver);
  }

  /**
   * Delete the message in conversation with current companion
   *
   * @param {number} messageId - The ID of deleted message
   */
  async deleteMessage({ messageId, receiver }) {
    this.webSocket.deleteMessage(messageId, receiver);
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

export default ChatModel;
