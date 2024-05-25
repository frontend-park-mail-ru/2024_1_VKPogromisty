import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import BaseView from "/public/MVC/BaseView.js";
import { API_URL } from "/public/modules/consts.js";
import UserState from "../UserState.js";
import { validateName } from "/public/modules/validators.js";
import "./sticker.scss";
import { makeSmallSticker, makeSticker } from "../../modules/makeComponents.js";
import { buildComponent } from "../createComponent.js";

/**
 * A Sticker structure
 *
 * @typedef {Object} Sticker
 * @property {number} authorId - The ID of author
 * @property {string} createdAt - The date when was created
 * @property {string} fileName - The name of file which interprets a sticker
 * @property {number} id - The ID of sticker
 * @property {string} name - The name of sticker
 * @property {string} updatedAt - The date when was updated
 */

const MBToByte = 1024 * 1024;
const maxMB = 5;
const correct = "form__input_correct";
const validExtensions = ["webp", "jpg", "jpeg", "png", "bmp", "gif"];
const incorrectType = "Недопустимый тип файла";
const exceededSize = `Максимальный размер файла ${maxMB}Мб`;
const staticUrl = `${API_URL}/static`;
const typeFile = (file) => {
  const parts = file.name.split(".");
  return parts[parts.length - 1];
};

/**
 * StickerView - класс для работы с визуалом на странице профиля.
 */
class StickerView extends BaseView {
  /**
   * Конструктор класса StickerView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;

    this.emojis = [];

    for (let i = 11; i < 45; ++i) {
      this.emojis.push(`${(i - (i % 10)) / 10}f${i % 10}`);
    }

    this.eventBus.addEventListener(
      "gotAllStickersSuccess",
      this.renderAllStickersPage.bind(this),
    );
    this.eventBus.addEventListener(
      "gotUserStickersSuccess",
      this.renderUserStickersPage.bind(this),
    );
    this.eventBus.addEventListener(
      "stickerCreatedSuccess",
      this.renderCreatedSticker.bind(this),
    );
    this.eventBus.addEventListener(
      "stickerDeletedSuccess",
      this.renderDeletedSticker.bind(this),
    );
    this.eventBus.addEventListener(
      "golAllMessageStickersSuccess",
      this.updateAllStickers.bind(this),
    );
    this.eventBus.addEventListener(
      "gotUserMessageStickersSuccess",
      this.updateMyStickers.bind(this),
    );
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  /**
   * Updates all sticker from the server
   *
   * @param {Sticker[]} stickers
   */
  updateAllStickers(stickers) {
    this.allStickers = stickers;
  }

  /**
   * Updates stickers of current user
   *
   * @param {Sticker[]} stickers
   */
  updateMyStickers(stickers) {
    this.myStickers = stickers;
  }

  /**
   * Sets current companion
   *
   * @param {number} companionId - The ID of current companion
   */
  setCompanion(companionId) {
    this.companionId = companionId;
  }

  /**
   * Renders all stickers on the chat page
   */
  renderMessageAllStickers() {
    const stickers = this.allStickers;

    const stickerMessagePlace = document.getElementById(
      "sticker-message-place-content",
    );
    stickerMessagePlace.innerHTML = "";

    document
      .getElementById("sticker-message-place-header")
      .classList.remove("sticker-message-place-header_invisible");
    document
      .getElementById("all-message-sticker")
      .classList.remove("sticker-message-place-header__span_small");
    document
      .getElementById("my-message-sticker")
      .classList.add("sticker-message-place-header__span_small");

    if (!stickers) {
      document
        .getElementById("no-message-stickers")
        ?.classList.remove("no-message-stickers_invisible");
      return;
    }

    stickers.forEach((sticker) => {
      stickerMessagePlace?.appendChild(
        makeSmallSticker({
          id: sticker.id,
          fileName: sticker.fileName,
          staticUrl,
          eventBus: this.eventBus,
          companionId: this.companionId,
        }),
      );
    });
  }

  /**
   * Renders user's stickers on the chat page
   */
  renderMessageMyStickers() {
    const stickers = this.myStickers;

    const stickerMessagePlace = document.getElementById(
      "sticker-message-place-content",
    );
    stickerMessagePlace.innerHTML = "";

    document
      .getElementById("sticker-message-place-header")
      .classList.remove("sticker-message-place-header_invisible");
    document
      .getElementById("my-message-sticker")
      .classList.remove("sticker-message-place-header__span_small");
    document
      .getElementById("all-message-sticker")
      .classList.add("sticker-message-place-header__span_small");

    if (!stickers) {
      document
        .getElementById("no-message-stickers")
        ?.classList.remove("no-message-stickers_invisible");
      return;
    }

    stickers.forEach((sticker) => {
      stickerMessagePlace?.appendChild(
        makeSmallSticker({
          id: sticker.id,
          fileName: sticker.fileName,
          staticUrl,
          eventBus: this.eventBus,
          companionId: this.companionId,
        }),
      );
    });
  }

  /**
   * Renders message emojies on the chat page
   */
  renderMessageEmoji() {
    const stickerMessagePlace = document.getElementById(
      "sticker-message-place-content",
    );
    stickerMessagePlace.innerHTML = "";

    document
      .getElementById("sticker-message-place-header")
      ?.classList.add("sticker-message-place-header_invisible");

    this.emojis.forEach((emoji) => {
      const messageEmoji = buildComponent(
        "img",
        { src: `dist/images/aE/${emoji}.png` },
        ["sticker-message-place-content__emoji-img"],
      );

      stickerMessagePlace.appendChild(messageEmoji);

      messageEmoji.addEventListener("click", () => {
        document.getElementById("print-message__text-input").innerHTML +=
          `<img src="dist/images/aE/${emoji}.png" class="sticker-message-place-content__emoji-img" />`;
      });
    });
  }

  /**
   * Renders header and sidebar of page
   * @param {string} path - The choice between all posts and own
   */
  renderStickerMain({ section }) {
    const template = require("./stickerMain.hbs");
    const { userId, avatar, firstName, lastName } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    if (!document.getElementById("sticker-catalog")) {
      document.getElementById("activity").innerHTML = template({});
    }

    document
      .getElementById("no-stickers-page")
      .classList.add("no-stickers-page_invisible");
    document.getElementById("sticker-catalog").innerHTML = "";

    this.setConstrains();

    document.getElementById("add-new-sticker").addEventListener("click", () => {
      this.isValid();
    });

    switch (section) {
      case "all":
        this.eventBus.emit("readyRenderAllStickers", {});
        break;
      case "own":
        this.eventBus.emit("readyRenderUserStickers", { userId });
        break;
      default:
        this.router.redirect("/stickers/all");
    }
  }

  /**
   * Sets constrains on input fields
   */
  setConstrains() {
    const inputFile = document.getElementById("new-sticker-image__input");
    const incorrectAvatar = document.getElementById("incorrect-avatar");
    const inputName = document.getElementById("new-sticker-name-field__input");
    const incorrectName = document.getElementById("incorrect-name");

    inputFile.addEventListener("change", () => {
      incorrectAvatar.classList.add(correct);

      const file = inputFile.files[0];
      const img = URL.createObjectURL(file);

      if (!validExtensions.includes(typeFile(file))) {
        incorrectAvatar.innerHTML = incorrectType;
        incorrectAvatar.classList.remove(correct);
        inputFile.files = null;
        document
          .getElementById("prewatch")
          .setAttribute("src", "dist/images/nothing.png");
      } else {
        if (file.size / MBToByte > maxMB) {
          incorrectAvatar.innerHTML = exceededSize;
          incorrectAvatar.classList.remove(correct);
          inputFile.files = null;
          document
            .getElementById("prewatch")
            .setAttribute("src", "dist/images/nothing.png");
        } else {
          document.getElementById("prewatch").setAttribute("src", img);
        }
      }
    });

    inputName.addEventListener("focusout", () => {
      incorrectName.classList.add(correct);

      if (!validateName(inputName.value.trim())) {
        incorrectName.classList.remove(correct);
      }
    });

    document
      .getElementById("sticker-add-block")
      .addEventListener("click", () => {
        inputFile.click();
      });
  }

  /**
   * Checks if fields' values are valid
   */
  isValid() {
    const inputFile = document.getElementById("new-sticker-image__input");
    const incorrectAvatar = document.getElementById("incorrect-avatar");
    const inputName = document.getElementById("new-sticker-name-field__input");
    const incorrectName = document.getElementById("incorrect-name");

    incorrectAvatar.classList.add(correct);
    incorrectName.classList.add(correct);

    let flag = true;

    const file = inputFile.files[0];

    if (file) {
      if (!validExtensions.includes(typeFile(file))) {
        incorrectAvatar.innerHTML = incorrectType;
        incorrectAvatar.classList.remove(correct);
        flag = false;
      }

      if (file.size / MBToByte > maxMB) {
        incorrectAvatar.innerHTML = exceededSize;
        incorrectAvatar.classList.remove(correct);
        flag = false;
      }
    } else {
      incorrectAvatar.innerHTML = incorrectType;
      incorrectAvatar.classList.remove(correct);
      flag = false;
    }

    if (!validateName(inputName.value)) {
      incorrectName.classList.remove(correct);
      flag = false;
    }

    if (!flag) {
      return false;
    }

    this.eventBus.emit("tryCreateSticker", {
      name: inputName.value,
      image: file,
    });

    document.getElementById("new-sticker-image__input").files = null;
    document.getElementById("new-sticker-image__input").value = null;
    document.getElementById("new-sticker-name-field__input").value = "";
    document
      .getElementById("prewatch")
      .setAttribute("src", "dist/images/nothing.png");
  }

  /**
   * Render all stickers at the sticker page
   *
   * @param {Sticker[]} stickers
   * @returns
   */
  renderAllStickersPage(stickers) {
    const mainElement = document.getElementById("sticker-catalog");

    if (!stickers.length) {
      document
        .getElementById("no-stickers-page")
        .classList.remove("no-stickers-page_invisible");
      return;
    }

    stickers.forEach((sticker) => {
      mainElement.appendChild(
        makeSticker({
          name: sticker.name,
          fileName: sticker.fileName,
          id: sticker.id,
          staticUrl,
          eventBus: this.eventBus,
        }),
      );
    });
  }

  /**
   * Render user's sticker at the stickers page
   *
   * @param {Sticker[]} stickers
   * @returns
   */
  renderUserStickersPage(stickers) {
    const mainElement = document.getElementById("sticker-catalog");

    if (!stickers.length) {
      document
        .getElementById("no-stickers-page")
        .classList.remove("no-stickers-page_invisible");
      return;
    }

    stickers.forEach((sticker) => {
      mainElement.appendChild(
        makeSticker({
          name: sticker.name,
          fileName: sticker.fileName,
          id: sticker.id,
          staticUrl,
          eventBus: this.eventBus,
          isMe: true,
        }),
      );
    });
  }

  /**
   * Adds sticker to the page
   *
   * @param {Sticker} sticker
   */
  renderCreatedSticker(sticker) {
    const mainElement = document.getElementById("sticker-catalog");
    const newSticker = makeSticker({
      name: sticker.name,
      fileName: sticker.fileName,
      id: sticker.id,
      staticUrl,
      eventBus: this.eventBus,
    });

    mainElement.appendChild(newSticker);
    newSticker.scrollIntoView();
  }

  /**
   * Deletes sticker from the page
   *
   * @param {number} id - The current sticker ID
   */
  renderDeletedSticker(id) {
    document.getElementById(`sticker-${id}`)?.remove();
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

export default StickerView;
