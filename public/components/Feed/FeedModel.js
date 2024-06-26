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
      this.getMyPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderAllPosts",
      this.getAllPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderFriendsPosts",
      this.getFriendsPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderGroupsPosts",
      this.getGroupsPosts.bind(this),
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
  async getMyPosts(lastPostId) {
    const result = await this.postService.getAllPosts(lastPostId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("getPostsSuccess", {
          posts: result.body,
          isMy: true,
        });
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
   * Gets different posts
   *
   * @param {number} lastPostId - The last post ID
   */
  async getAllPosts(lastPostId) {
    const result = await this.postService.getNewPosts(lastPostId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("getPostsSuccess", { posts: result.body });
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
   * Gets friends' posts
   *
   * @param {number} lastPostId - The last post ID
   */
  async getFriendsPosts(lastPostId) {
    const result = await this.postService.getFriendsPosts(lastPostId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("getFriendsPostSuccess", result.body);
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
   * Gets groups' posts
   *
   * @param {number} lastPostId - The last post ID
   */
  async getGroupsPosts(lastPostId) {
    const result = await this.postService.getGroupsPosts(lastPostId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("getGroupsPostSuccess", result.body);
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
