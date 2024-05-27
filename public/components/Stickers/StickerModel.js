import BaseModel from "../../MVC/BaseModel.js";
import { StickerService } from "../../modules/services.js";

/**
 * @typedef {Object} UpdateInfo
 * @property {number} stickerId - The ID of current sticker
 * @property {string} content - The text of current sticker
 */

/**
 * StickerModel - класс для обработки данных, общения с бэком.
 */
class StickerModel extends BaseModel {
  /**
   * Конструктор класса StickerModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {UserState} userState - Текущее состояние юзера
   */
  constructor(eventBus, router, webSocket) {
    super(eventBus);

    this.router = router;
    this.webSocket = webSocket;
    this.stickerService = new StickerService();

    this.eventBus.addEventListener(
      "readyRenderUserStickers",
      this.getUserStickers.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderAllStickers",
      this.getAllStickers.bind(this),
    );
    this.eventBus.addEventListener(
      "tryCreateSticker",
      this.createSticker.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedDeleteSticker",
      this.deleteSticker.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedSendSticker",
      this.sendStickerMessage.bind(this),
    );
  }

  /**
   * Gets all stickers
   */
  async getAllStickers({ isMessage }) {
    const result = await this.stickerService.getAllStickers();

    switch (result.status) {
      case 200:
        if (isMessage) {
          this.eventBus.emit("golAllMessageStickersSuccess", result.body);
        } else {
          this.eventBus.emit("gotAllStickersSuccess", result.body);
        }
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Gets current user stickers
   *
   * @param {number} userId - The ID of user
   */
  async getUserStickers({ userId, isMessage }) {
    const result = await this.stickerService.getUserStickers(userId);

    switch (result.status) {
      case 200:
        if (isMessage) {
          this.eventBus.emit("gotUserMessageStickersSuccess", result.body);
        } else {
          this.eventBus.emit("gotUserStickersSuccess", result.body);
        }
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Creates a new sticker by its name and image
   *
   * @param {string} name - The name of sticker
   * @param {File} image - The image of sticker
   */
  async createSticker({ name, image }) {
    const result = await this.stickerService.createSticker(name, image);

    switch (result.status) {
      case 201:
        this.eventBus.emit("stickerCreatedSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Deletes current sticker
   *
   * @param {number} stickerId - The ID of sticker
   */
  async deleteSticker(stickerId) {
    const result = await this.stickerService.deleteSticker(stickerId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("stickerDeletedSuccess", stickerId);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Sends sticker message in conversation with current companion
   *
   * @param {number} companionId - The ID of current companion
   * @param {number} stickerId - The ID of current sticker
   */
  async sendStickerMessage({ companionId, stickerId }) {
    this.webSocket.sendStickerMessage(stickerId, companionId);
  }
}

export default StickerModel;
