import FeedModel from "./FeedModel.js";
import FeedView from "./FeedView.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = [
  "readyRenderPosts",
  "clickLogoutButton",
  "getPostsSuccess",
  "clickedPublishPost",
  "publishedPostSuccess",
  "serverError",
];

/**
 * FeedController - класс для связи FeedModel и FeedView.
 * @property {FeedView} FeedView - FeedView - класс для работы с визуалом на странице.
 * @property {FeedModel} FeedModel - FeedModel - класс для обработки данных, общения с бэком.
 */
class FeedController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.feedModel = new FeedModel(this.eventBus, router, webSocket);
    this.feedView = new FeedView(this.eventBus, router);
  }

  /**
   * Renders Feed
   * @returns {void}
   */
  renderFeed() {
    this.feedView.renderFeedMain();
  }

  deleteScrollListener() {}
}

export default FeedController;
