import BaseView from "../../MVC/BaseView.js";
import {
  formatDayMonthYear,
  formatMinutesHours,
} from "../../modules/dateRemaking.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "/public/modules/consts.js";
import UserState from "../UserState.js";
import "./message.scss";
import { customAlert } from "../../modules/windows.js";
import { buildComponent, appendChildren } from "../createComponent.js";
import { makeMessage } from "../../modules/makeComponents.js";

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

const imageTypes = ["webp", "jpg", "jpeg", "png", "gif"];
const MB = 1024 * 1024;
const maxMessageMemory = 20;
const staticUrl = `${API_URL}/static`;
const maxMessageLength = 1000;
const typeFile = (file) => {
  const parts = file.name.split(".");
  return parts[parts.length - 1];
};
const typeName = (file) => {
  const parts = file.split(".");
  return parts[parts.length - 1];
};

/**
 * ChatView - класс для работы с визуалом на странице.
 */
class ChatView extends BaseView {
  /**
   * Конструктор класса ChatView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus, router, stickerController) {
    super(eventBus);

    this.router = router;
    this.stickerController = stickerController;
    this.isAddedListener = false;
    this.stickerController = stickerController;
    this.isAddedListener = false;
    this.rememberMessageWithAttachments = {};

    this.eventBus.addEventListener(
      "receiveCompanionData",
      this.renderCompanion.bind(this),
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
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  /**
   * Renders the main part of page of conversation with current companion
   *
   * @param {number} companionId
   */
  renderMain(companionId) {
    this.companionId = +companionId;

    const { userId, avatar, firstName, lastName } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);
    document.getElementById("toolbar").classList.add("toolbar_invisible");

    this.mainElement = document.getElementById("activity");
    this.lastMessageId = 0;
    this.isAllMessages = false;
    this.isAddedListener = false;

    document.onkeydown = (event) => {
      if (event.key === "Escape") {
        this.router.redirect("/messenger");
      }
    };

    this.stickerController.updateStickers(UserState.userId);

    this.eventBus.emit("readyRenderCompanion", this.companionId);
  }

  /**
   * Checks if user scrolled enough
   */
  checksNewMessages() {
    if (
      !this.isAllMessages &&
      !this.isWaitMessages &&
      this.chatElement.scrollHeight + this.chatElement.scrollTop <= 750
    ) {
      this.eventBus.emit("readyRenderMessages", {
        companionId: this.companionId,
        lastMessageId: this.lastMessageId,
      });
      this.isWaitMessages = true;
    }
  }

  /**
   * Renders the data of current companion
   *
   * @param {User} user - The current companion data
   */
  renderCompanion({ User }) {
    let { userId, avatar, firstName, lastName } = User;

    const template = require("./chatMain.hbs");
    const isMe = userId === UserState.userId;
    avatar = avatar || "default_avatar.png";

    this.mainElement.innerHTML = template({
      userId,
      avatar,
      firstName,
      lastName,
      staticUrl,
      isMe,
    });

    this.chatElement = document.getElementById("messages");
    this.previousDate = null;

    const dt = new DataTransfer();
    let dtMemory = 0;
    const input = document.getElementById("print-message__text-input");
    const sendButton = document.getElementById("message-menu__send-button");
    const addFiles = document.getElementById("news__img");
    const chatFileInput = document.getElementById("news-chat__file-input");
    const imgContent = document.getElementById("captured-images");
    const fileContent = document.getElementById("captured-files");

    input.addEventListener("paste", (event) => {
      event.preventDefault();

      let text = (event.originalEvent || event).clipboardData.getData(
        "text/plain",
      );

      input.innerHTML += text;
    });

    addFiles.addEventListener("click", () => {
      chatFileInput.click();
    });

    chatFileInput.addEventListener("change", () => {
      const files = chatFileInput.files;

      Array.from(files).forEach((file) => {
        if (dtMemory + file.size > maxMessageMemory * MB) {
          customAlert(
            "error",
            `Максимальный размер сообщения - ${maxMessageMemory}мб`,
          );
          return;
        }

        if (dt.items.length === 5) {
          customAlert(
            "error",
            "Максимальное количество прикрепляемых файлов - 5",
          );
          return;
        }

        dtMemory += file.size;
        dt.items.add(file);

        const src = URL.createObjectURL(file);
        const fileName = file.name;
        const isImage = imageTypes.includes(typeFile(file));

        const cancelImg = buildComponent(
          "img",
          { src: "dist/images/cancel.webp", "data-id": fileName },
          [`news-message-${isImage ? "img" : "file"}-content__cancel-img`],
        );

        cancelImg.addEventListener("click", () => {
          document
            .getElementById(
              `news-message-${isImage ? "img" : "file"}-content-block-${fileName}`,
            )
            ?.remove();

          Array.from(dt.files).forEach((file, index) => {
            if (file.name === fileName) {
              dtMemory -= file.size;
              dt.items.remove(index);
              return;
            }
          });
        });

        if (isImage) {
          const imgBlock = buildComponent(
            "div",
            { id: `news-message-img-content-block-${fileName}` },
            ["news-message-img-content-block"],
          );

          appendChildren(imgContent, [
            appendChildren(imgBlock, [
              buildComponent(
                "img",
                { src: src, "data-id": `news-file-content-${fileName}` },
                ["news-message-img-content__img"],
              ),
              cancelImg,
            ]),
          ]);
        } else {
          const fileBlock = buildComponent(
            "div",
            { id: `news-message-file-content-block-${fileName}` },
            ["news-message-file-content-block"],
          );
          appendChildren(fileContent, [
            appendChildren(fileBlock, [
              appendChildren(
                buildComponent(
                  "a",
                  {
                    target: "_blank",
                    rel: "noopener",
                    href: src,
                    download: fileName,
                  },
                  ["news-message-file-content__a"],
                ),
                [
                  buildComponent(
                    "span",
                    {},
                    ["news-message-file-content__name-span"],
                    fileName,
                  ),
                  buildComponent(
                    "img",
                    {
                      src: "dist/images/document.webp",
                      id: `news-message-file-content-${fileName}`,
                    },
                    ["news-message-file-content__img"],
                  ),
                ],
              ),
              cancelImg,
            ]),
          ]);
        }
      });

      chatFileInput.value = null;
    });

    sendButton.addEventListener("click", () => {
      let textMessage = input.innerHTML;

      if (textMessage.trim() === "" && dt.items.length === 0) {
        return;
      }

      textMessage = textMessage.replaceAll(
        ' class="sticker-message-place-content__emoji-img"',
        "",
      );
      textMessage = textMessage.replaceAll(
        ' style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; font-size: 16px; font-family: Inter, sans-serif;"',
        "",
      );
      textMessage = textMessage.replaceAll('<img src="dist/images', "*_");
      textMessage = textMessage.replaceAll(
        '<img src="http://localhost:3000/chat/dist/images',
        "*_",
      );
      textMessage = textMessage.replaceAll(
        '<img src="https://socio-project.ru/chat/dist/images',
        "*_",
      );
      textMessage = textMessage.replaceAll('.webp">', ".webp");

      this.chatElement.scrollTop = 0;

      while (textMessage.length > maxMessageLength) {
        this.eventBus.emit("clickedSendMessage", {
          companionId: this.companionId,
          textContent: textMessage.substring(0, maxMessageLength),
        });

        textMessage = textMessage.substring(maxMessageLength);
      }

      if (dt.items.length > 0) {
        this.eventBus.emit("needPresentAttachments", {
          companionId: this.companionId,
          textContent: textMessage,
          attachments: dt.files,
        });

        dt.items.clear();

        fileContent.innerHTML = "";
        imgContent.innerHTML = "";
      } else {
        this.eventBus.emit("clickedSendMessage", {
          companionId: this.companionId,
          textContent: textMessage,
        });
      }

      input.innerHTML = "";
      input.focus();
    });

    input.onkeydown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendButton.click();
      }
    };

    document
      .getElementById("all-message-sticker")
      .addEventListener("click", () => {
        this.stickerController.renderMessageAllStickers(this.companionId);
      });

    document
      .getElementById("my-message-sticker")
      .addEventListener("click", () => {
        this.stickerController.renderMessageUserStickers(this.companionId);
      });

    document
      .getElementById("message-menu__send-sticker-button")
      .addEventListener("click", () => {
        const stickerMessagePlace = document.getElementById(
          "sticker-message-place",
        );

        if (
          stickerMessagePlace.classList.contains(
            "sticker-message-place_invisible",
          ) ||
          stickerMessagePlace.classList.contains(
            "sticker-message-place_invisible-not-first",
          )
        ) {
          this.stickerController.renderMessageEmoji();
        }

        if (
          stickerMessagePlace.classList.contains(
            "sticker-message-place_invisible",
          )
        ) {
          stickerMessagePlace.classList.remove(
            "sticker-message-place_invisible",
          );
        } else {
          stickerMessagePlace.classList.toggle(
            "sticker-message-place_invisible-not-first",
          );
        }

        if (!this.isAddedListener) {
          this.isAddedListener = true;
          document.addEventListener("click", (event) => {
            if (!this.clickedOnStickerMessagePlace(event)) {
              stickerMessagePlace.classList.add(
                "sticker-message-place_invisible-not-first",
              );
            }
          });
        }
      });

    document
      .getElementById("message-place-stickers")
      .addEventListener("click", () => {
        this.stickerController.renderMessageAllStickers(this.companionId);
      });

    document
      .getElementById("message-place-emoji")
      .addEventListener("click", () => {
        this.stickerController.renderMessageEmoji();
      });

    this.chatElement.addEventListener(
      "scroll",
      this.checksNewMessages.bind(this),
    );

    this.eventBus.emit("readyRenderMessages", {
      companionId: this.companionId,
      lastMessageId: 0,
    });
  }

  /**
   * Checks if clicked in sticker place
   *
   * @param {Event} event - Current event
   * @returns
   */
  clickedOnStickerMessagePlace(event) {
    let target = event.target;
    while (target !== document.body) {
      if (!target) {
        return false;
      }

      if (
        target.classList.contains("sticker-message-place") ||
        target.classList.contains("message-menu__send-sticker-button")
      ) {
        return true;
      }

      target = target.parentNode;
    }
    return false;
  }

  /**
   * Renders the messages of conversation with current companion
   *
   * @param {Message[]} messages - The messages of conversation with current companion
   */
  renderMessages(messages) {
    document.getElementById("messages-sceleton")?.remove();

    this.isWaitMessages = false;
    const noMessages = messages.length === 0;

    messages.forEach((elem) => {
      const messageDate = new Date(elem.createdAt);
      this.previousDate = this.previousDate || messageDate;

      if (
        formatDayMonthYear(messageDate) !==
        formatDayMonthYear(this.previousDate)
      ) {
        elem.changedDay = formatDayMonthYear(this.previousDate);
        this.previousDate = messageDate;
      }
      elem.isMe = elem.senderId === UserState.userId;
      elem.isUpdated = elem.createdAt !== elem.updatedAt;
      elem.fullCreatedAt = formatDayMonthYear(elem.createdAt);
      elem.createdAt = formatMinutesHours(elem.createdAt);
      if (elem.id < this.lastMessageId || this.lastMessageId === 0) {
        this.lastMessageId = elem.id;
      }

      if (elem.changedDay) {
        this.chatElement.appendChild(
          appendChildren(buildComponent("div", {}, ["changed-day"]), [
            buildComponent("span", {}, ["changed-day__span"], elem.changedDay),
          ]),
        );
      }

      elem.content = elem.content.replaceAll(
        "*_/aE/",
        '<img class="sticker-message-place-content__emoji-img" src="dist/images/aE/',
      );
      elem.content = elem.content.replaceAll(".webp", '.webp" >');

      this.chatElement.appendChild(
        makeMessage(elem, staticUrl, this.companionId, this.eventBus),
      );
    });

    if (noMessages || messages.length < 20) {
      this.isAllMessages = true;
      if (this.lastMessageId > 0) {
        const lastChangedDay = document.createElement("div");
        lastChangedDay.classList.add("changed-day");

        const lastChangedDaySpan = document.createElement("span");
        lastChangedDaySpan.classList.add("changed-day__span");
        lastChangedDaySpan.innerHTML = formatDayMonthYear(this.previousDate);

        lastChangedDay.appendChild(lastChangedDaySpan);

        this.chatElement.appendChild(lastChangedDay);
      }

      this.chatElement.appendChild(
        buildComponent(
          "span",
          { id: "messages__start-dialog-span" },
          ["messages__start-dialog-span"],
          "Начните диалог",
        ),
      );
    }

    if (!this.isAllMessages) {
      const imgSceleton = document.createElement("img");

      imgSceleton.classList.add("sceleton-img");
      imgSceleton.setAttribute("id", "messages-sceleton");
      imgSceleton.setAttribute("src", "dist/images/loading.webp");

      this.chatElement.appendChild(imgSceleton);
    }
  }

  /**
   * Adds the messages of conversation with current companion
   *
   * @param {Message[]} messages - The messages of conversation with current companion
   */
  renderAddMessage(message) {
    if (window.location.pathname !== `/chat/${this.companionId}`) {
      return;
    }
    if (
      message.senderId !== +this.companionId &&
      message.receiverId !== +this.companionId
    ) {
      return;
    }

    const mayNewDay = this.chatElement.firstElementChild;
    const formatToday = formatDayMonthYear(new Date());

    if (
      mayNewDay &&
      mayNewDay.classList.contains("message-ables") &&
      mayNewDay.dataset.timecreated !== formatToday
    ) {
      const lastChangedDay = document.createElement("div");
      lastChangedDay.classList.add("changed-day");

      const lastChangedDaySpan = document.createElement("span");
      lastChangedDaySpan.classList.add("changed-day__span");
      lastChangedDaySpan.innerHTML = formatToday;

      lastChangedDay.appendChild(lastChangedDaySpan);

      this.chatElement.insertBefore(
        lastChangedDay,
        this.chatElement.firstElementChild,
      );
    }

    message.isMe = message.senderId === UserState.userId;
    message.fullCreatedAt = formatDayMonthYear(message.createdAt);
    message.createdAt = formatMinutesHours(message.createdAt);
    message.content = message.content.replaceAll(
      "*_/aE/",
      '<img class="sticker-message-place-content__emoji-img" src="dist/images/aE/',
    );
    message.content = message.content.replaceAll(".webp", '.webp" >');

    this.chatElement.insertBefore(
      makeMessage(message, staticUrl, this.companionId, this.eventBus),
      this.chatElement.firstElementChild,
    );

    const noMessagesSpan = document.getElementById(
      "messages__start-dialog-span",
    );

    if (noMessagesSpan) {
      noMessagesSpan.remove();
    }
  }

  /**
   * Updates the message of conversation with current companion
   *
   * @param {Message} message - The message of conversation with current companion
   */
  renderUpdateMessage(message) {
    if (window.location.pathname !== `/chat/${this.companionId}`) {
      return;
    }

    document.getElementById("captured-images").innerHTML = "";
    document.getElementById("captured-files").innerHTML = "";
    const messageContentDiv = document.querySelector(
      `#message-${message.id} .message-content-div`,
    );
    messageContentDiv.innerHTML = "";

    message.content = message.content.replaceAll(
      "*_/aE/",
      '<img class="sticker-message-place-content__emoji-img" src="dist/images/aE/',
    );
    message.content = message.content.replaceAll(".webp", '.webp" >');

    const contentPlace = buildComponent(
      "div",
      { id: `message-content-${message.id}` },
      ["message-content"],
      message.content,
    );

    appendChildren(messageContentDiv, [contentPlace]);

    if (!document.getElementById(`message-edited-${message.id}`)) {
      const messageEdited = document.createElement("span");

      messageEdited.classList.add("message-time-edited__span-edited");
      messageEdited.setAttribute("id", `message-edited-${message.id}`);
      messageEdited.innerHTML = "ред.";

      document
        .getElementById(`message-time-edited-${message.id}`)
        .appendChild(messageEdited);
    }

    message.attachments?.forEach((attachment) => {
      if (imageTypes.includes(typeName(attachment))) {
        appendChildren(messageContentDiv, [
          appendChildren(buildComponent("div", {}, ["message-image-content"]), [
            buildComponent(
              "img",
              {
                src: `${staticUrl}/message-attachments/${attachment}`,
                "data-filename": attachment,
              },
              ["message-attachment__img"],
            ),
          ]),
        ]);
      } else {
        appendChildren(messageContentDiv, [
          appendChildren(buildComponent("div", {}, ["message-file-content"]), [
            appendChildren(
              buildComponent(
                "a",
                {
                  target: "_blank",
                  rel: "noopener",
                  href: `${staticUrl}/message-attachments/${attachment}`,
                  download: attachment,
                },
                ["message-file-content__a"],
              ),
              [
                buildComponent(
                  "span",
                  {},
                  ["message-file-content__name-span"],
                  attachment,
                ),
                buildComponent("img", { src: "dist/images/document.webp" }, [
                  "message-file-content__img",
                ]),
              ],
            ),
          ]),
        ]);
      }
    });
  }

  /**
   * Deletes the message of conversation with current companion
   *
   * @param {Message} message - The message of conversation with current companion
   */
  renderDeleteMessage(message) {
    if (window.location.pathname !== `/chat/${this.companionId}`) {
      return;
    }
    const messageAtPage = document.getElementById(
      `message-${message.messageId}`,
    );

    if (messageAtPage) {
      messageAtPage.parentElement.remove();
    }

    const undeletedChangedDay = this.chatElement.firstElementChild;
    if (
      undeletedChangedDay &&
      undeletedChangedDay.classList.contains("changed-day")
    ) {
      undeletedChangedDay.remove();
    }
  }

  /**
   * Shows that mistake called
   * @return {void}
   */
  serverErrored() {
    const serverError = document.getElementById("server-error-500");

    serverError.classList.remove("server-error-500");
  }
}

export default ChatView;
