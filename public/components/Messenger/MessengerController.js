import MessengerModel from "./MessengerModel.js";
import MessengerView from "./MessengerView.js";
import EventBus from "../../MVC/EventBus.js";

const incomingEvents = [
  "needUpgradeWebSocket",
  "sendMessageSuccess",
  "needGetProfile",
  "receiveProfileData",
  "updateLastMessage",
  "updatedWebSocket",
  "readyRenderDialogs",
  "getDialogsSuccess",
  "clickedLogoutButton",
  "serverError",
];

/**
 * MessengerController - класс для связи MessengerModel и MessengerView.
 * @property {EventBus} eventBus - EventBus - класс для обработки событий между View и Model
 * @property {MessengerView} MessengerView - MessengerView - класс для работы с визуалом на странице.
 * @property {MessengerModel} MessengerModel - MessengerModel - класс для обработки данных, общения с бэком.
 */
class MessengerController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.messengerModel = new MessengerModel(this.eventBus, router, webSocket);
    this.messengerView = new MessengerView(this.eventBus, router);
  }

  /**
   * Renders MessengerView
   */
  renderMessengerView() {
    this.messengerView.renderMain();
  }
}

export default MessengerController;
