import { ChatService, ProfileService } from "../../modules/services.js";
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

    this.eventBus.addEventListener(
      "readyRenderCompanion",
      this.getCompanion.bind(this),
    );
    this.eventBus.addEventListener('needOpenWebSocket', this.openWebSocket.bind(this));
    this.eventBus.addEventListener('readyRenderMessages', this.getMessages.bind(this));
  }

  async getCompanion(companionId) {
    const result =
      await this.profileService.getOtherProfileData(companionId);

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

  async openWebSocket(companionId) {
    const response = await fetch(API_URL + '/chat/', {
      method: 'GET',
      credentials: 'include',
    })

    this.ws = new WebSocket(WEBSOCKET_URL);
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
}

export default MessengerModel;
