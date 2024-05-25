import CommentModel from "./CommentModel.js";
import CommentView from "./CommentView.js";
import EventBus from "../../MVC/EventBus.js";

const incomingEvents = [
  "clickedDeleteComment",
  "clickedUnlikeComment",
  "clickedLikeComment",
  "commentsGotSuccess",
  "commentAddedSuccess",
  "commentDeletedSuccess",
  "commentLikedSuccess",
  "commentUnlikedSuccess",
  "clickedUpdateComment",
  "commentUpdatedSuccess",
  "serverError",
];

/**
 * CommentController - класс для связи CommentModel и CommentView.
 * @property {EventBus} eventBus - EventBus - класс для обработки событий между View и Model
 * @property {CommentView} CommentView - CommentView - класс для работы с визуалом на странице.
 * @property {CommentModel} CommentModel - CommentModel - класс для обработки данных, общения с бэком.
 */
class CommentController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   */
  constructor(router) {
    this.eventBus = new EventBus(incomingEvents);
    this.commentModel = new CommentModel(this.eventBus, router);
    this.commentView = new CommentView(this.eventBus, router);
  }

  /**
   * Renders all comments of post
   *
   * @param {number} postId - The ID of current post
   */
  renderComments(postId) {
    this.commentModel.getPostComments(postId);
  }

  /**
   * Adds comment to the post
   *
   * @param {*} commentBody
   */
  addComment(commentBody) {
    this.commentModel.addPostComment(commentBody);
  }
}

export default CommentController;
