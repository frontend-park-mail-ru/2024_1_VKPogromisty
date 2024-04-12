import PostModel from "./PostModel.js";
import PostView from "./PostView.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = [
  "clickedUpdatePost",
  "canceledUpdatePost",
  "postCanceledSuccess",
  "clickedDeleteButton",
  "postUpdateSuccess",
  "postDeleteSuccess",
  "serverError",
];

/**
 * MessengerController - класс для связи PostModel и PostView.
 * @property {EventBus} eventBus - EventBus - класс для обработки событий между View и Model
 * @property {MessengerView} PostView - PostView - класс для работы с визуалом на странице.
 * @property {MessengerModel} PostModel - PostModel - класс для обработки данных, общения с бэком.
 */
class PostController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {UserState} userState - The current state of session's user
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, userState) {
    this.eventBus = new EventBus(incomingEvents);
    this.postModel = new PostModel(this.eventBus, router, userState);
    this.postView = new PostView(this.eventBus, userState);
  }

  /**
   * Renders MessengerView
   */
  renderPostView(post) {
    this.postView.renderPost(post);
  }
}

export default PostController;
