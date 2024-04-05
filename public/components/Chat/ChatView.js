import BaseView from "./public/MVC/BaseView.js";
import {
  remakeCreatedAt,
  remakeDateOfBirth,
} from "../../modules/dateRemaking.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL, WEBSOCKET_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

/**
 * ChatView - класс для работы с визуалом на странице.
 */
class ChatView extends BaseView {
  /**
   * Конструктор класса ChatView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus, router, userState) {
    super(eventBus);

    this.router = router;
    this.userState = userState;

    this.eventBus.addEventListener(
      "getMessagesSuccess",
      this.renderMessages.bind(this),
    );
    this.eventBus.addEventListener('receiveCompanionData', this.renderCompanion.bind(this));
    this.eventBus.addEventListener('openedWebSocket', this.openedWebSocket.bind(this));
    this.eventBus.addEventListener('getMessagesSuccess', this.renderMessages.bind(this));
  }

  renderMain(companionId) {
    this.companionId = companionId;

    const { userId, avatar, firstName, lastName } = this.userState;

    if (document.getElementById("header") === null) {
      const header = new Header(document.body);

      header.renderForm({ userId, avatar, firstName, lastName });
    }

    if (document.getElementById("main") === null) {
      const main = new Main(document.body);

      main.renderForm(userId);
    }

    document.getElementById("logout-button").addEventListener("click", () => {
      this.eventBus.emit("clickLogoutButton", {});
    });

    document
      .getElementById("server-error-500")
      .classList.add("server-error-500");

    this.mainElement = document.getElementById("activity");

    this.eventBus.emit("readyRenderCompanion", this.companionId);
  }

  renderCompanion({User}) {
    const {userId, avatar, firstName, lastName} = User;

    const template = Handlebars.templates["chatMain.hbs"];

    this.mainElement.innerHTML = template({
      userId,
      avatar,
      firstName,
      lastName,
    });

    this.eventBus.emit('needOpenWebSocket', this.companionId);
  }

  openedWebSocket() {
    this.eventBus.emit('readyRenderMessages', {'companionId': this.companionId, 'lastMessage': 0});
  }

  renderMessages(messages) {

    if (!messages) {
      messages = [];
    }

    const template = Handlebars.templates["chatMain.hbs"];
    const noMessages = messages.length === 0;

    this.mainElement.innerHTML = template({ messages, noMessages });
  }
}

export default ChatView;
