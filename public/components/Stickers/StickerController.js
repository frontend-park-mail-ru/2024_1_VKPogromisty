import EventBus from "../../MVC/EventBus.js";
import StickerView from "./StickerView.js";
import StickerModel from "./StickerModel.js";

const incomingEvents = [
  "readyRenderAllStickers",
  "readyRenderUserStickers",
  "stickerCreatedSuccess",
  "stickerDeletedSuccess",
  "gotAllStickersSuccess",
  "gotUserStickersSuccess",
  "golAllMessageStickersSuccess",
  "gotUserMessageStickersSuccess",
  "tryCreateSticker",
  "clickedDeleteSticker",
  "clickedSendSticker",
  "serverError",
];

/**
 * StickerController - класс для связи StickerModel и StickerView.
 * @property {StickerView} StickerView - StickerView - класс для работы с визуалом на странице.
 * @property {StickerModel} StickerModel - StickerModel - класс для обработки данных, общения с бэком.
 */
class StickerController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.stickerModel = new StickerModel(this.eventBus, router, webSocket);
    this.stickerView = new StickerView(this.eventBus, router);
  }

  /**
   * Renders StickerView
   *
   * @param {string} path - The current path of sticker's page
   *
   * @returns {void}
   */
  renderStickerPage(path) {
    this.stickerView.renderStickerMain(path);
  }

  /**
   * Updates user's sticker from the server
   *
   * @param {number} userId - The ID of current user
   */
  updateStickers(userId) {
    this.stickerModel.getAllStickers({ isMessage: true });
    this.stickerModel.getUserStickers({ isMessage: true, userId });
  }

  /**
   * Renders stickers at chat page
   *
   * @param {number} companionId - The ID of current companion
   */
  renderMessageAllStickers(companionId) {
    this.stickerView.setCompanion(companionId);
    this.stickerView.renderMessageAllStickers();
  }

  /**
   * Renders stickers at chat page
   *
   * @param {number} companionId - The ID of current companion
   */
  renderMessageUserStickers(companionId) {
    this.stickerView.setCompanion(companionId);
    this.stickerView.renderMessageMyStickers();
  }

  /**
   * Renders message emoji
   */
  renderMessageEmoji() {
    this.stickerView.renderMessageEmoji();
  }
}

export default StickerController;
