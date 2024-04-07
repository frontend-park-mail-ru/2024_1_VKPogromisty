import BaseView from "./public/MVC/BaseView.js";
import { formatMinutesHours } from "../../modules/dateRemaking.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "/public/modules/consts.js";

/**
 * A User structure
 * @typedef {Object} User
 * @property {string} avatar - The avatar of user
 * @property {string} createdAt - The date of creating accout
 * @property {string} detaOfBirth - The date of birth current user
 * @property {string} email - The email of current user
 * @property {string} firstName - The first name of current user
 * @property {string} lastName - The last name of current user
 * @property {number} userId - The ID of current user
 * @property {string} updatedAt - The last date of updating
 */

/**
 * A Message structure
 * @typedef {Object} Message
 * @property {number} id - The ID of message
 * @property {string} createdAt - The date of creating accout
 * @property {string} content - The text content of current message
 * @property {number} receiverId - The ID of receiver current message
 * @property {number} senderId - The ID of sender current message
 * @property {string} updatedAt - The last date of updating
 */

/**
 * A Dialog structure
 * @typedef {Object} Dialog
 * @property {Message} lastMessage - The last message of dialog
 * @property {User} user1 - The first user
 * @property {User} user2 - The second user
 */

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

  /**
   * Renders main part of page of messenger
   */
  renderMain() {
    const { userId, avatar, firstName, lastName } = this.userState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    document.getElementById("logout-button").addEventListener("click", () => {
      this.eventBus.emit("clickedLogoutButton", {});
    });

    this.mainElement = document.getElementById("activity");

    this.eventBus.emit("readyRenderDialogs", {});
  }

  /**
   * Renders current dialogs of session's user
   *
   * @param {Dialog[]} dialogs
   */
  renderDialogs(dialogs) {
    const template = Handlebars.templates["messengerMain.hbs"];
    const noDialogs = dialogs.length === 0;

    dialogs.forEach((elem) => {
      if (elem.user1.userId === this.userState.userId) {
        elem.companion = elem.user2;
      } else {
        elem.companion = elem.user1;
      }

      elem.lastMessage.createdAt = formatMinutesHours(
        elem.lastMessage.createdAt,
      );
    });

    this.mainElement.innerHTML = template({ staticUrl, dialogs, noDialogs });

    const chats = document.querySelectorAll(".dialog");
    chats.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.router.redirect(`/chat/${elem.dataset.id}`);
      });
    });
  }
}

export default MessengerView;
