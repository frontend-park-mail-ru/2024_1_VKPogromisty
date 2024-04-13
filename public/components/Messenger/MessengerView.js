import BaseView from "../../MVC/BaseView.js";
import { formatMinutesHours } from "../../modules/dateRemaking.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "/public/modules/consts.js";
import UserState from "../UserState.js";

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
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.promissedMessages = new Map();

    this.eventBus.addEventListener(
      "updatedWebSocket",
      this.updatedWebSocket.bind(this),
    );
    this.eventBus.addEventListener(
      "sendMessageSuccess",
      this.sendedMessage.bind(this),
    );
    this.eventBus.addEventListener(
      "updateLastMessage",
      this.updatedMessage.bind(this),
    );
    this.eventBus.addEventListener(
      "receiveProfileData",
      this.addDialog.bind(this),
    );
    this.eventBus.addEventListener(
      "getDialogsSuccess",
      this.renderDialogs.bind(this),
    );
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  /**
   * Renders main part of page of messenger
   */
  renderMain() {
    const { userId, avatar, firstName, lastName } = UserState;

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
    this.mainElement.innerHTML = Handlebars.templates["messengerMain.hbs"]({
      noDialogs: true,
    });
    this.dialogsElement = document.getElementById("dialogs");

    this.eventBus.emit("needUpgradeWebSocket", {});
  }

  updatedWebSocket() {
    this.eventBus.emit("readyRenderDialogs", {});
  }

  sendedMessage(message) {
    if (window.location.pathname !== "/messenger") {
      return;
    }
    if (message.senderId === UserState.userId) {
      if (document.getElementById(`dialog-${message.receiverId}`)) {
        document.getElementById(
          `chatter-info__message-span-${message.receiverId}`,
        ).innerHTML = message.content;
        document.getElementById(
          `chatter-content__time-span-${message.receiverId}`,
        ).innerHTML = formatMinutesHours(message.createdAt);
      } else {
        this.promissedMessages.set(message.receiverId, {
          content: message.content,
          createdAt: formatMinutesHours(message.createdAt),
          id: message.id,
        });
        this.eventBus.emit("needGetProfile", message.receiverId);
      }
    } else {
      if (document.getElementById(`dialog-${message.senderId}`)) {
        const messageContent = document.querySelector(
          `#dialog-${message.senderId} .chatter-content__message-span`,
        );
        messageContent.innerHTML = message.content;
        messageContent.setAttribute(
          "id",
          `chatter-content__message-span-${message.senderId}-${message.id}`,
        );
        const messageTime = document.querySelector(
          `#dialog-${message.senderId} .chatter-content__time-span`,
        );
        messageTime.innerHTML = formatMinutesHours(message.createdAt);
        messageTime.setAttribute(
          "id",
          `chatter-content__time-span-${message.senderId}-${message.id}`,
        );
      } else {
        this.promissedMessages.set(message.senderId, {
          content: message.content,
          createdAt: formatMinutesHours(message.createdAt),
          id: message.id,
        });
        this.eventBus.emit("needGetProfile", message.senderId);
      }
    }
  }

  updatedMessage(message) {
    if (window.location.pathname !== "/messenger") {
      return;
    }
    if (message.senderId === UserState.userId) {
      if (document.getElementById(`dialog-${message.receiverId}`)) {
        document.getElementById(
          `chatter-info__message-span-${message.receiverId}`,
        ).innerHTML = message.content;
      }
    } else {
      if (document.getElementById(`dialog-${message.senderId}`)) {
        document.getElementById(
          `chatter-content__message-span-${message.senderId}-${message.id}`,
        ).innerHTML = message.content;
      }
    }
  }

  addDialog(profile) {
    const lastMessage = this.promissedMessages.get(profile.User.userId);
    this.promissedMessages.delete(profile.User.userId);
    this.dialogsElement.innerHTML += Handlebars.templates["messenge.hbs"]({
      staticUrl,
      elem: { companion: profile.User, lastMessage },
    });
    const chats = document.querySelectorAll(".dialog");
    chats.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.router.redirect(`/chat/${elem.dataset.id}`);
      });
    });
  }

  /**
   * Renders current dialogs of session's user
   *
   * @param {Dialog[]} dialogs
   */
  renderDialogs(dialogs) {
    const template = Handlebars.templates["messenge.hbs"];
    const noDialogs = document.getElementById("no-dialogs__span");

    dialogs.forEach((elem) => {
      if (elem.user1.userId === UserState.userId) {
        elem.companion = elem.user2;
      } else {
        elem.companion = elem.user1;
      }

      elem.lastMessage.createdAt = formatMinutesHours(
        elem.lastMessage.createdAt,
      );

      this.dialogsElement.innerHTML += template({ staticUrl, elem });

      noDialogs?.remove();
    });

    const chats = document.querySelectorAll(".dialog");
    chats.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.router.redirect(`/chat/${elem.dataset.id}`);
      });
    });
  }

  /**
   * Shows that mistake called
   * @return {void}
   */
  serverErrored() {
    const serverError = document.getElementById("server-error-500");

    serverError?.classList.remove("server-error-500");
  }
}

export default MessengerView;
