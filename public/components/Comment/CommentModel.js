import BaseModel from "../../MVC/BaseModel";
import { PostService } from "../../modules/services";

class CommentModel extends BaseModel {
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.postService = new PostService();

    this.eventBus.addEventListener(
      "clickedDeleteComment",
      this.deleteComment.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedUnlikeComment",
      this.unlikeComment.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedLikeComment",
      this.likeComment.bind(this),
    );
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

export default CommentModel;
