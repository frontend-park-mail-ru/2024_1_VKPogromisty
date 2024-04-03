import FeedModel from "./FeedModel.js";
import FeedView from "./FeedView.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = [
  "readyRenderPosts",
  "clickedLogoutButton",
  "clickedPublishButton",
  "clickedDeleteButton",
  "receiveOwnProfileData",
  "postsGetSuccess",
  "postPublishedSuccess",
  "deletePostSuccess",
  "serverError",
];

class FeedController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   */
  constructor(router) {
    this.eventBus = new EventBus(incomingEvents);
    this.feedModel = new FeedModel(this.eventBus, router);
    this.feedView = new FeedView(this.eventBus, router);
  }

  renderFeedView() {
    this.feedModel.getPosts();
  }
}

export default FeedController;
