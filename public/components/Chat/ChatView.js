import BaseView from "./public/MVC/BaseView.js";
import {
  remakeCreatedAt,
  remakeDateOfBirth,
  remakeLastMessage,
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
      "receiveCompanionData",
      this.renderCompanion.bind(this),
    );
    this.eventBus.addEventListener(
      "openedWebSocket",
      this.openedWebSocket.bind(this),
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

    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        if (input.value === "") {
          return;
        }

        this.eventBus.emit("clickedSendMessage", {
          companionId: this.companionId,
          textContent: input.value,
        });

        input.value = "";
      }
    });

    this.chatElement = document.getElementById("messages");

    const printMessage = document.getElementById('print-message');
    const messageTextarea = document.getElementById('print-message__text-input');

    messageTextarea.addEventListener("input", () => {
      messageTextarea.style.height = "auto";
      messageTextarea.style.height = messageTextarea.scrollHeight - 4 + "px";
      printMessage.style.height = 'auto';
      printMessage.style.height = printMessage.scrollHeight - 4 + 'px';
    });

    this.eventBus.emit("needOpenWebSocket", this.companionId);
  }

  openedWebSocket() {
    this.eventBus.emit("readyRenderMessages", {
      companionId: this.companionId,
      lastMessage: 0,
    });
  }

  renderMessages(messages) {
    const template = Handlebars.templates["message.hbs"];
    const noMessages = messages.length === 0;

    messages.forEach((elem) => {
      elem.isMe = elem.senderId === this.userState.userId;
      elem.isUpdated = elem.createdAt !== elem.updatedAt;
      elem.createdAt = remakeLastMessage(elem.createdAt);
    });

    this.chatElement.innerHTML = template({ messages, noMessages });

    const trashes = document.querySelectorAll(".message__trash-basket-img");
    const edits = document.querySelectorAll('.message__edit-img');

    trashes.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.eventBus.emit("clickedDeleteMessage", elem.dataset.id);
      });
    });

    edits.forEach((elem) => {
      elem.addEventListener('click', () => {
        const inputMessage = document.getElementById('print-message__text-input');
        const sendMessage = document.getElementById('message-menu__send-button');
        const messageId = elem.dataset.id;
        const messageContent = document.getElementById(`message-content-${messageId}`);
        const okMessage = document.createElement('img');
        const parentSend = sendMessage.parentElement;
        
        okMessage.setAttribute('src', '../static/images/check.png');
        okMessage.setAttribute('data-id', messageId);
        okMessage.classList.add('message-menu__accept-img');

        okMessage.addEventListener('click', () => {
          if (inputMessage.value !== messageContent.innerHTML) {
            this.eventBus.emit('clickedUpdateMessage', {messageId: messageId, textContent: inputMessage.value});
          }

          sendMessage.style.display = 'block';
          okMessage.remove();
          inputMessage.value = '';
        });
        
        inputMessage.value = messageContent.innerHTML;
        sendMessage.style.display = 'none';
        parentSend.insertBefore(okMessage, sendMessage);
      });
    });
  }

  renderAddMessage(message) {
    const template = Handlebars.templates["message.hbs"];
    const messages = [message];

    message.isMe = message.senderId === this.userState.userId;
    message.createdAt = remakeLastMessage(message.createdAt);

    this.chatElement.innerHTML =
      template({ messages }) + this.chatElement.innerHTML;

    const noMessagesSpan = document.getElementById(
      "messages__start-dialog-span",
    );

    if (noMessagesSpan) {
      noMessagesSpan.remove();
    }
  }

  renderUpdateMessage(message) {
    const messageAtPage = document.getElementById(`message-${message.id}`);

    if (messageAtPage) {
      messageAtPage.remove();
    }
  }

  renderDeleteMessage(message) {
    const messageAtPage = document.getElementById(`message-${message.id}`);

    if (messageAtPage) {
      messageAtPage.remove();
    }
  }
}

export default ChatView;
