/**
 * A PostInfo structure
 * @typedef {Object} PostInfo
 * @property {number} userId - The ID of user
 * @property {number} lastPostId - The ID of last post of current user
 */

import BaseModel from "/public/MVC/BaseModel.js";
import {
  AuthService,
  PostService,
  ProfileService,
  SubscriptionsService,
} from "../../modules/services.js";

/**
 * ProfileModel - класс для обработки данных, общения с бэком на странице профиля.
 */
class ProfileModel extends BaseModel {
  /**
   * Конструктор класса ProfileModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus) {
    super(eventBus);

    this.profileService = new ProfileService();
    this.postService = new PostService();
    this.subscriptionsService = new SubscriptionsService();

    this.eventBus.addEventListener("clickLogoutButton", this.logout.bind(this));
    this.eventBus.addEventListener(
      "readyRenderProfile",
      this.getProfileData.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedSubscribe",
      this.subscribeToUser.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedUnsubscribe",
      this.unsubscribeFromUser.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderPosts",
      this.getPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedPublishPost",
      this.publishPost.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedDeletePost",
      this.deletePost.bind(this),
    );
  }

  /**
   * Gets the data of user current session
   * @return {void}
   */
  async getOwnProfileData() {
    const resultOwnProfile = await this.profileService.getOwnProfileData();

    switch (resultOwnProfile.status) {
      case 200:
        this.eventBus.emit("receiveOwnProfileData", resultOwnProfile.body.User);
        break;
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Gets the data of user current profile
   * @param {number} userId - The ID of user current profile
   * @return {void}
   */
  async getProfileData(userId) {
    const resultProfileMain =
      await this.profileService.getOtherProfileData(userId);

    switch (resultProfileMain.status) {
      case 200:
        this.eventBus.emit("receiveProfileData", resultProfileMain.body);
        break;
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Subscribes on user current profile
   * @param {number} userId - The ID of user current profile
   * @return {void}
   */
  async subscribeToUser(userId) {
    const result = await this.subscriptionsService.postSubscription(userId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("subscribedSuccess", {});
        break;
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Unsubscribes from user current profile
   * @param {number} userId - The ID of user current profile
   * @return {void}
   */
  async unsubscribeFromUser(userId) {
    const result = await this.subscriptionsService.deleteSubscription(userId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("unsubscribedSuccess", {});
        break;
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Unsubscribes from user current profile
   * @param {PostInfo} postInfo - The info about required posts
   * @return {void}
   */
  async getPosts({ userId, lastPostId }) {
    const result = await this.postService.getPosts(userId, lastPostId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("getPostsSuccess", result.body);
        break;
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Publishes the post to user's profile
   * @param {string} content - The text content of post
   * @return {void}
   */
  async publishPost({ content, attachments }) {
    const result = await this.postService.publishPost(content, attachments);

    switch (result.status) {
      case 201:
        this.eventBus.emit("publishedPostSuccess", result.body);
        break;
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Deletes the post from user's profile
   * @param {number} post_id - The ID of post current profile
   * @return {void}
   */
  async deletePost(post_id) {
    const result = await this.postService.deletePost(post_id);

    switch (result.status) {
      case 204:
        this.eventBus.emit("postDeleteSuccess", post_id);
        break;
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Logouts from account
   * @return {void}
   */
  async logout() {
    const authService = new AuthService();

    const result = await authService.logout();

    switch (result.status) {
      case 200:
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default ProfileModel;
