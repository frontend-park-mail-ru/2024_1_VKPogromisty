import ProfileModel from "./ProfileModel.js";
import ProfileView from "./ProfileView.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = [
  "receiveProfileData",
  "receiveProfilePosts",
  "receiveOwnProfileData",
  "clickLogoutButton",
  "logoutSuccess",
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
  "serverError",
];

class ProfileController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   */
  constructor(router) {
    this.eventBus = new EventBus(incomingEvents);
    this.profileModel = new ProfileModel(this.eventBus);
    this.profileView = new ProfileView(
      this.eventBus,
      document.getElementById("activity"),
    );

    this.eventBus.addEventListener(
      "logoutSuccess",
      router.redirect.bind(router),
    );
  }

  /**
   * Renders ProfileView
   * @returns {void}
   */
  renderProfileView({ userId }) {
    this.profileModel.getOwnProfileData();
    this.profileView.setUserId(userId);
  }
}

export default ProfileController;
