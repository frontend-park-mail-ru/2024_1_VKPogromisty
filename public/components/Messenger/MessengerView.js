import BaseView from "./public/MVC/BaseView.js";
import {
  remakeCreatedAt,
  remakeDateOfBirth,
} from "../../modules/dateRemaking.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

/**
 * MessengerView - класс для работы с визуалом на странице.
 */
class MessengerView extends BaseView {
  /**
   * Конструктор класса MessengerView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus, router, userState) {
    super(eventBus);

    this.router = router;
    this.userState = userState;

    this.eventBus.addEventListener(
      "getDialogsSuccess",
      this.renderDialogs.bind(this),
    );
  }

  renderMain() {
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

    this.eventBus.emit("readyRenderDialogs", {});
  }

  renderDialogs(dialogs) {
    const template = Handlebars.templates["messengerMain.hbs"];
    const noDialogs = dialogs.length === 0;

    this.mainElement.innerHTML = template({ dialogs, noDialogs });

    const chats = document.querySelectorAll(".dialog");
    chats.forEach((elem) => {
      this.router.redirect(`/chat/${elem.dataset.id}`);
    });
  }
}

export default MessengerView;
