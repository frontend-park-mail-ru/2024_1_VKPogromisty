import ChatModel from "./ChatModel.js";
import ChatView from "./ChatView.js";
import EventBus from "../../MVC/EventBus.js";

const incomingEvents = [
  "readyRenderCompanion",
  "receiveCompanionData",
  "readyRenderMessages",
  "getMessagesSuccess",
  "clickedSendMessage",
  "clickedDeleteMessage",
  "clickedUpdateMessage",
  "sendMessageSuccess",
  "updateMessageSuccess",
  "deleteMessageSuccess",
  "serverError",
];

/**
 * ChatController - класс для связи ChatModel и ChatView.
 * @property {EventBus} EventBus - EventBus - класс для обработки событий между View и Model
 * @property {MessengerView} ChatView - ChatView - класс для работы с визуалом на странице.
 * @property {MessengerModel} ChatModel - ChatModel - класс для обработки данных, общения с бэком.
 */
class ChatController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {WSocket} webSocket - The working WebSocket that receive and send messages
   */
  constructor(router, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.chatModel = new ChatModel(this.eventBus, router, webSocket);
    this.chatView = new ChatView(this.eventBus, router);
  }

  /**
   * Renders MessengerView
   * @param {Object} param0 - The object with companion ID
   * @param {number} param0.companionId - The ID of current companion
   * @returns {void}
   */
  renderChatView({ companionId }) {
    this.chatView.renderMain(companionId);
  }
}

export default ChatController;
