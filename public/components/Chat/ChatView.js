import BaseView from "./public/MVC/BaseView.js";
import {
  formatMinutesHours,
  formatFullDate,
  formatDayMonthYear,
} from "../../modules/dateRemaking.js";
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
      "receiveCompanionData",
      this.renderCompanion.bind(this),
    );
    this.eventBus.addEventListener(
      "updatedWebSocket",
      this.updatedWebSocket.bind(this),
    );
    this.eventBus.addEventListener(
      "getMessagesSuccess",
      this.renderMessages.bind(this),
    );
    this.eventBus.addEventListener(
      "sendMessageSuccess",
      this.renderAddMessage.bind(this),
    );
    this.eventBus.addEventListener(
      "deleteMessageSuccess",
      this.renderDeleteMessage.bind(this),
    );
    this.eventBus.addEventListener(
      "updateMessageSuccess",
      this.renderUpdateMessage.bind(this),
    );
  }

  /**
   * Renders the main part of page of conversation with current companion
   *
   * @param {number} companionId
   */
  renderMain(companionId) {
    this.companionId = companionId;

    const { userId, avatar, firstName, lastName } = this.userState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    this.mainElement = document.getElementById("activity");

    this.eventBus.emit("readyRenderCompanion", this.companionId);
  }

  /**
   * Renders the data of current companion
   *
   * @param {User} user - The current companion data
   */
  renderCompanion({ User }) {
    const { userId, avatar, firstName, lastName } = User;

    const template = Handlebars.templates["chatMain.hbs"];

    this.mainElement.innerHTML = template({
      userId,
      avatar,
      firstName,
      lastName,
      staticUrl,
    });

    const input = document.getElementById("print-message__text-input");

    document
      .getElementById("message-menu__send-button")
      .addEventListener("click", () => {
        if (input.value === "") {
          return;
        }

        this.eventBus.emit("clickedSendMessage", {
          companionId: this.companionId,
          textContent: input.value,
        });

        input.value = "";
      });

    input.addEventListener(
      "keypress",
      (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          if (input.value === "") {
            return;
          }

          this.eventBus.emit("clickedSendMessage", {
            companionId: this.companionId,
            textContent: input.value,
          });

          input.value = "";
        }
      },
      { capture: true },
    );

    this.chatElement = document.getElementById("messages");

    const printMessage = document.getElementById("print-message");
    const messageTextarea = document.getElementById(
      "print-message__text-input",
    );

    messageTextarea.addEventListener("input", () => {
      messageTextarea.style.height = "auto";
      messageTextarea.style.height = messageTextarea.scrollHeight - 4 + "px";
      printMessage.style.height = "auto";
      printMessage.style.height = printMessage.scrollHeight - 4 + "px";
    });

    this.eventBus.emit("needUpdateWebSocket", this.companionId);
  }

  /**
   * Preparing to render messages
   */
  updatedWebSocket() {
    this.eventBus.emit("readyRenderMessages", {
      companionId: this.companionId,
      lastMessageId: 0,
    });
  }

  /**
   * Renders the messages of conversation with current companion
   *
   * @param {Message[]} messages - The messages of conversation with current companion
   */
  renderMessages(messages) {
    const template = Handlebars.templates["message.hbs"];
    const noMessages = messages.length === 0;

    messages.forEach((elem) => {
      elem.isMe = elem.senderId === this.userState.userId;
      elem.isUpdated = elem.createdAt !== elem.updatedAt;
      elem.createdAt = formatMinutesHours(elem.createdAt);
    });

    this.chatElement.innerHTML = template({ messages, noMessages });

    const trashes = document.querySelectorAll(".message__trash-basket-img");
    const edits = document.querySelectorAll(".message__edit-img");

    trashes.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.eventBus.emit("clickedDeleteMessage", {
          messageId: elem.dataset.id,
          receiver: this.companionId,
        });
      });
    });

    edits.forEach((elem) => {
      this.acceptUpdateListener(elem);
    });
  }

  /**
   * Adds the messages of conversation with current companion
   *
   * @param {Message[]} messages - The messages of conversation with current companion
   */
  renderAddMessage(message) {
    const template = Handlebars.templates["message.hbs"];
    const messages = [message];

    message.isMe = message.senderId === this.userState.userId;
    message.createdAt = formatMinutesHours(message.createdAt);

    this.chatElement.innerHTML =
      template({ messages }) + this.chatElement.innerHTML;

    const noMessagesSpan = document.getElementById(
      "messages__start-dialog-span",
    );

    if (noMessagesSpan) {
      noMessagesSpan.remove();
    }

    const trashes = document.querySelectorAll(".message__trash-basket-img");
    const edits = document.querySelectorAll(".message__edit-img");

    trashes.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.eventBus.emit("clickedDeleteMessage", {
          messageId: elem.dataset.id,
          receiver: this.companionId,
        });
      });
    });

    edits.forEach((elem) => {
      this.acceptUpdateListener(elem);
    });
  }

  /**
   * Adds listener to accepting changing message element
   *
   * @param {Element} elem
   */
  acceptUpdateListener(elem) {
    elem.addEventListener("click", () => {
      const inputMessage = document.getElementById("print-message__text-input");
      const sendMessage = document.getElementById("message-menu__send-button");
      const messageId = elem.dataset.id;
      const messageContent = document.getElementById(
        `message-content-${messageId}`,
      );
      const okMessage = document.createElement("img");
      const parentSend = sendMessage.parentElement;

      okMessage.setAttribute("src", "../static/images/check.png");
      okMessage.setAttribute("data-id", messageId);
      okMessage.classList.add("message-menu__accept-img");

      okMessage.addEventListener("click", () => {
        if (inputMessage.value !== messageContent.innerHTML) {
          this.eventBus.emit("clickedUpdateMessage", {
            messageId: messageId,
            textContent: inputMessage.value,
            receiver: this.companionId,
          });
        }

        sendMessage.style.display = "block";
        okMessage.remove();
        inputMessage.value = "";
      });

      inputMessage.value = messageContent.innerHTML;
      sendMessage.style.display = "none";
      parentSend.insertBefore(okMessage, sendMessage);
    });
  }

  /**
   * Updates the message of conversation with current companion
   *
   * @param {Message} message - The message of conversation with current companion
   */
  renderUpdateMessage(message) {
    const contentPlace = document.getElementById(
      `message-content-${message.id}`,
    );

    contentPlace.innerHTML = message.content;

    if (!document.getElementById(`message-edited-${message.id}`)) {
      const messageEdited = document.createElement("span");

      messageEdited.classList.add("message-time-edited__span-edited");
      messageEdited.setAttribute("id", `message-edited-${message.id}`);
      messageEdited.innerHTML = "ред.";

      document
        .getElementById(`message-time-edited-${message.id}`)
        .appendChild(messageEdited);
    }
  }

  /**
   * Deletes the message of conversation with current companion
   *
   * @param {Message} message - The message of conversation with current companion
   */
  renderDeleteMessage(message) {
    const messageAtPage = document.getElementById(
      `message-${message.messageId}`,
    );

    if (messageAtPage) {
      messageAtPage.parentElement.remove();
    }
  }
}

export default ChatView;
