import BaseModel from "../../MVC/BaseModel.js";
import { PostService, ProfileService } from "../../modules/services.js";

/**
 * @typedef {Object} UpdateInfo
 * @property {number} postId - The ID of current post
 * @property {string} content - The text of current post
 */

/**
 * PostModel - класс для обработки данных, общения с бэком.
 */
class PostModel extends BaseModel {
  /**
   * Конструктор класса PostModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {UserState} userState - Текущее состояние юзера
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.profileService = new ProfileService();
    this.postService = new PostService();

    this.router = router;

    this.eventBus.addEventListener(
      "clickedUpdatePost",
      this.updatePost.bind(this),
    );
    this.eventBus.addEventListener(
      "canceledUpdatePost",
      this.getCurrentPost.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedDeleteButton",
      this.deletePost.bind(this),
    );
  }

  /**
   * Gets current post
   *
   * @param {number} postId - The ID of current post
   */
  async getCurrentPost(postId) {
    const result = await this.postService.getCurrentPost(postId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("postCanceledSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Updates current post
   *
   * @param {UpdateInfo} updateInfo - The info about updated post
   */
  async updatePost({ postId, content }) {
    const result = await this.postService.updatePost(postId, content);

    switch (result.status) {
      case 200:
        this.eventBus.emit("postUpdateSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Deletes current post
   *
   * @param {number} postId - The ID of current post
   */
  async deletePost(postId) {
    const result = await this.postService.deletePost(postId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("postDeleteSuccess", postId);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default PostModel;