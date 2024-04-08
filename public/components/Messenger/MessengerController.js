import MessengerModel from "./MessengerModel.js";
import MessengerView from "./MessengerView.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = [
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
   * @param {UserState} userState - The current state of session's user
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, userState, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.messengerModel = new MessengerModel(
      this.eventBus,
      router,
      webSocket,
      userState,
    );
    this.messengerView = new MessengerView(this.eventBus, router, userState);
  }

  /**
   * Renders MessengerView
   */
  renderMessengerView() {
    this.messengerView.renderMain();
  }
}

export default MessengerController;
