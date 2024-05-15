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
    this.eventBus.addEventListener("clickedLikePost", this.likePost.bind(this));
    this.eventBus.addEventListener(
      "clickedUnlikePost",
      this.unlikePost.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedDeleteButton",
      this.deletePost.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderPost",
      this.getCurrentPost.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderComments",
      this.getPostComments.bind(this),
    );
    this.eventBus.addEventListener(
      "postCommentAdded",
      this.addPostComment.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedDeleteComment",
      this.deleteComment.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedLikeComment",
      this.likeComment.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedUnlikeComment",
      this.unlikeComment.bind(this),
    );
  }

  /**
   * Gets current post
   *
   * @param {number} postId - The ID of current post
   * @param {boolean} isCanceled - Was post necessary for updating
   */
  async getCurrentPost({ postId, isCanceled }) {
    const result = await this.postService.getCurrentPost(postId);

    switch (result.status) {
      case 200:
        if (isCanceled) {
          this.eventBus.emit("postCanceledSuccess", result.body);
        } else {
          this.eventBus.emit("postLoadedSuccess", result.body);
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
   * Likes post
   *
   * @param {number} postId - The ID of current post
   */
  async likePost(postId) {
    const result = await this.postService.likePost(postId);

    switch (result.status) {
      case 201:
        this.eventBus.emit("postLikedSuccess", result.body.postId);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Unlikes post
   *
   * @param {number} postId - The ID of current post
   */
  async unlikePost(postId) {
    const result = await this.postService.unlikePost(postId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("postUnlikedSuccess", postId);
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

  /**
   * Gets all comments of post
   *
   * @param {number} postId - The ID of post
   */
  async getPostComments(postId) {
    const result = await this.postService.getPostComments(postId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("commentsGotSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Adds new comment of current post
   *
   * @param {number} postId - The ID of post
   * @param {string} content - The content of new comment
   */
  async addPostComment({ postId, content }) {
    const result = await this.postService.addPostComments(postId, content);

    switch (result.status) {
      case 201:
        this.eventBus.emit("commentAddedSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Deletes current comment of post
   *
   * @param {number} commentId - The ID of current post
   */
  async deleteComment({ commentId }) {
    const result = await this.postService.deleteComment(commentId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("commentDeletedSuccess", commentId);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Likes current comment
   *
   * @param {number} commentId - The ID of current comment
   */
  async likeComment(commentId) {
    const result = await this.postService.likeComment(commentId);

    switch (result.status) {
      case 201:
        this.eventBus.emit("commentLikedSuccess", commentId);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Unlikes current comment of post
   *
   * @param {number} commentId - The ID of current post
   */
  async unlikeComment(commentId) {
    const result = await this.postService.unlikeComment(commentId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("commentUnlikedSuccess", commentId);
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
