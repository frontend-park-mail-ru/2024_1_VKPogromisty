import PostModel from "./PostModel.js";
import PostView from "./PostView.js";
import EventBus from "../../MVC/EventBus.js";

/**
 * A Post structure
 * @typedef {Object} Post
 * @property {number} authorId - The ID of author
 * @property {string} createdAt - The date of creating post
 * @property {string} content - The text content of post
 * @property {number} postId - The ID of post
 * @property {string} updatedAt - The last date of updating
 * @property {File[]} attachments - The images of post
 */

const incomingEvents = [
  "clickedUpdatePost",
  "canceledUpdatePost",
  "postCanceledSuccess",
  "postLoadedSuccess",
  "clickedDeleteButton",
  "clickedLikePost",
  "postLikedSuccess",
  "clickedUnlikePost",
  "postUnlikedSuccess",
  "postUpdateSuccess",
  "postDeleteSuccess",
  "readyRenderPost",
  "postCommentAdded",
  "needRenderPostMain",
  "serverError",
];

/**
 * PostController - класс для связи PostModel и PostView.
 * @property {EventBus} eventBus - EventBus - класс для обработки событий между View и Model
 * @property {PostView} PostView - PostView - класс для работы с визуалом на странице.
 * @property {PostModel} PostModel - PostModel - класс для обработки данных, общения с бэком.
 */
class PostController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   */
  constructor(router) {
    this.eventBus = new EventBus(incomingEvents);
    this.postModel = new PostModel(this.eventBus, router);
    this.postView = new PostView(this.eventBus, router);
  }

  /**
   * Renders a page with current post
   *
   * @param {number} postId - The ID of post
   */
  renderPostPage({ postId }) {
    this.postView.renderPostMain(postId);
  }

  /**
   * Renders PostView
   *
   * @param {Post} post - The current post
   */
  renderFriendPostView(post) {
    this.postView.renderFriendPost(post);
  }

  /**
   * Renders PostView
   *
   * @param {Post} post - The current post
   */
  renderGroupPostView(post) {
    this.postView.renderGroupPost(post);
  }
}

export default PostController;
