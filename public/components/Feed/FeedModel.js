import BaseModel from "/public/MVC/BaseModel.js";
import { AuthService, PostService } from "../../modules/services.js";

/**
 * FeedModel - класс для обработки данных, общения с бэком на странице профиля.
 */
class FeedModel extends BaseModel {
  /**
   * Конструктор класса FeedModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   * @param {WSocket} webSocket - Текущий сокет
   */
  constructor(eventBus, router, webSocket) {
    super(eventBus);

    this.router = router;
    this.webSocket = webSocket;
    this.postService = new PostService();

    this.eventBus.addEventListener(
      "readyRenderPosts",
      this.getFriendPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedPublishPost",
      this.publishPost.bind(this),
    );
    this.eventBus.addEventListener("clickLogoutButton", this.logout.bind(this));
    this.eventBus.addEventListener(
      "clickedDeletePost",
      this.deletePost.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedUpdatePost",
      this.updatePost.bind(this),
    );
  }

  /**
   * Gets the new posts
   *
   * @param {number} lastPostId - The ID of last post at feed
   */
  async getFriendPosts(lastPostId) {
    const result = await this.postService.getFriendsPosts(lastPostId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("getPostsSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Publishes the post to user's feed
   * @param {string} content - The text content of post
   * @param {File[]} attachments - The attachments
   * @return {void}
   */
  async publishPost({ content, attachments }) {
    const result = await this.postService.publishPost(content, attachments);

    switch (result.status) {
      case 201:
        this.eventBus.emit("publishedPostSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Deletes the post from user's feed
   * @param {number} post_id - The ID of post current feed
   * @return {void}
   */
  async deletePost(post_id) {
    const result = await this.postService.deletePost(post_id);

    switch (result.status) {
      case 204:
        this.eventBus.emit("postDeleteSuccess", post_id);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Updates the post from user's feed
   * @param {number} post_id - The ID of post current feed
   * @param {string} content - The text content of current post
   * @return {void}
   */
  async updatePost({ post_id, content }) {
    const result = await this.postService.updatePost(post_id, content);

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
   * Logouts from account
   * @return {void}
   */
  async logout() {
    const authService = new AuthService();

    const result = await authService.logout();

    switch (result.status) {
      case 200:
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default FeedModel;
