import BaseModel from "/public/MVC/BaseModel.js";
import { PostService } from "../../modules/services.js";

/**
 * FeedModel - класс для обработки данных, общения с бэком на странице профиля.
 */
class FeedModel extends BaseModel {
  /**
   * Конструктор класса FeedModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.postService = new PostService();

    this.eventBus.addEventListener(
      "readyRenderPosts",
      this.getFriendPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedPublishPost",
      this.publishPost.bind(this),
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
      case 404:
        this.eventBus.emit("getPostsSuccess", []);
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
}

export default FeedModel;
