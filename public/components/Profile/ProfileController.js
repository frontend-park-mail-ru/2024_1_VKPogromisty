import ProfileModel from "./ProfileModel.js";
import ProfileView from "./ProfileView.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = [
  "receiveProfileData",
  "receiveProfilePosts",
  "receiveOwnProfileData",
  "clickLogoutButton",
  "readyRenderProfile",
  "clickedSubscribe",
  "clickedUnsubscribe",
  "subscribedSuccess",
  "unsubscribedSuccess",
  "readyRenderPosts",
  "getPostsSuccess",
  "clickedPublishPost",
  "clickedDeletePost",
  "postDeleteSuccess",
  "publishedPostSuccess",
  "clickedUpdatePost",
  "postUpdateSuccess",
  "serverError",
];

/**
 * ProfileController - класс для связи ProfileModel и ProfileView.
 * @property {ProfileView} ProfileView - ProfileView - класс для работы с визуалом на странице.
 * @property {ProfileModel} ProfileModel - ProfileModel - класс для обработки данных, общения с бэком.
 */
class ProfileController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {UserState} userState - The current state of session's user
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, userState, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.profileModel = new ProfileModel(
      this.eventBus,
      router,
      webSocket,
      userState,
    );
    this.profileView = new ProfileView(this.eventBus, router, userState);
  }

  /**
   * Renders ProfileView
   * @returns {void}
   */
  renderProfileView({ userId }) {
    this.profileView.renderProfileMain(userId);
  }
}

export default ProfileController;
