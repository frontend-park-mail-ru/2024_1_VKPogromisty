/**
 * A Author structure
 * @typedef {Object} Author
 * @property {string} avatar - The avatar of user
 * @property {string} createdAt - The date of creating accout
 * @property {string} detaOfBirth - The date of birth current user
 * @property {string} email - The email of current user
 * @property {string} firstName - The first name of current user
 * @property {string} lastName - The last name of current user
 * @property {number} userId - The ID of current user
 * @property {string} updatedAt - The last date of updating
 */

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

/**
 * A PostInfo structure
 * @typedef {Object} PostInfo
 * @property {Author} author - The info about author of post
 * @property {Post[]} posts - The posts of current user
 */

/**
 * A UserInfo structure
 * @typedef {Object} UserInfo
 * @property {number} userId - The ID of user
 * @property {string} firstName - The first name of session's user
 * @property {string} lastName - The first name of session's user
 * @property {string} avatar - The file path of avatar of session's user
 */

/**
 * A ProfileInfo structure
 * @typedef {Object} ProfileInfo
 * @property {UserInfo} User - The info about profile's user
 * @property {boolean} isSubscribedTo - Is the session's user a subscriber of profile's user
 */

import {
  remakeCreatedAt,
  remakeDateOfBirth,
} from "../../modules/dateRemaking.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import BaseView from "/public/MVC/BaseView.js";
import { API_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

/**
 * ProfileView - класс для работы с визуалом на странице профиля.
 */
class ProfileView extends BaseView {
  /**
   * Конструктор класса ProfileView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus, userId) {
    super(eventBus);

    this.userId = userId;

    this.eventBus.addEventListener(
      "receiveOwnProfileData",
      this.renderProfileMain.bind(this),
    );
    this.eventBus.addEventListener(
      "receiveProfileData",
      this.renderProfile.bind(this),
    );
    this.eventBus.addEventListener(
      "receiveProfilePosts",
      this.renderPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "subscribedSuccess",
      this.updateSubscribed.bind(this),
    );
    this.eventBus.addEventListener(
      "unsubscribedSuccess",
      this.updateUnsubscribed.bind(this),
    );
    this.eventBus.addEventListener(
      "getPostsSuccess",
      this.renderPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "postDeleteSuccess",
      this.postDeletedSuccess.bind(this),
    );
    this.eventBus.addEventListener(
      "publishedPostSuccess",
      this.postPublishedSuccess.bind(this),
    );
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  /**
   * Sets the ID of user, whose profile we check
   * @param {number} userId - The id of user
   */
  setUserId(userId) {
    this.userId = userId;
  }

  /**
   * Renders header and sidebar of page
   * @param {UserInfo} userInfo - The info about session's user
   * @memberof typedefs
   */
  renderProfileMain({ userId, avatar, firstName, lastName }) {
    this.ownUserId = userId;
    this.avatar = avatar;

    if (document.getElementById("header") === null) {
      const header = new Header(document.body);

      header.renderForm({ userId, avatar, firstName, lastName });
    }

    if (document.getElementById("main") === null) {
      const main = new Main(document.body);

      main.renderForm(userId);
    }

    document.getElementById("logout-button").addEventListener("click", () => {
      this.eventBus.emit("clickLogoutButton", {});
    });

    document
      .getElementById("server-error-500")
      .classList.add("server-error-500");

    this.eventBus.emit("readyRenderProfile", this.userId);
  }

  /**
   * Renders header and sidebar of page
   * @param {UserInfo} userInfo - The info about session's user
   */

  /**
   * Renders user's profile
   * @param {ProfileInfo} profileInfo - The info of profile's user
   */
  renderProfile({ User, isSubscribedTo }) {
    User.dateOfBirth = remakeDateOfBirth(User.dateOfBirth);

    const { userId, firstName, lastName, dateOfBirth, avatar } = User;
    this.mainElement = document.getElementById("activity");
    const isMe = (this.isMe = Number(this.userId) === Number(this.ownUserId));

    const template = Handlebars.templates["profileMain.hbs"];
    this.mainElement.innerHTML = template({
      avatar,
      firstName,
      lastName,
      dateOfBirth,
      userId,
      staticUrl,
      isMe,
      isSubscribedTo,
    });

    this.postsElement = document.getElementById("posts");

    this.eventBus.emit("readyRenderPosts", {
      userId: this.userId,
      lastPostId: 0,
    });
  }

  /**
   * Updates button of profile post if subscribed
   * @return {void}
   */
  updateSubscribed() {
    this.subscribeUser.classList.remove(
      "subscribed-to-options__button-subscribe",
    );
    this.subscribeUser.classList.add(
      "subscribed-to-options__button-unsubscribe",
    );
    this.subscribeUser.innerHTML = "Отписаться";
    this.sendMessageUser.classList.remove(
      "subscribed-to-options__button-subscribe-message",
    );
    this.sendMessageUser.classList.add(
      "subscribed-to-options__button-unsubscribe-message",
    );
  }

  /**
   * Updates button of profile post if unsubscribed
   * @return {void}
   */
  updateUnsubscribed() {
    this.subscribeUser.classList.remove(
      "subscribed-to-options__button-unsubscribe",
    );
    this.subscribeUser.classList.add("subscribed-to-options__button-subscribe");
    this.subscribeUser.innerHTML = "Подписаться";
    this.sendMessageUser.classList.remove(
      "subscribed-to-options__button-unsubscribe-message",
    );
    this.sendMessageUser.classList.add(
      "subscribed-to-options__button-subscribe-message",
    );
  }

  /**
   * Updates button of profile post if subscribed
   * @param {PostInfo} postInfo - The info about user's posts
   * @return {void}
   */
  renderPosts({ author, posts }) {
    const template = Handlebars.templates["profilePost.hbs"];
    const avatar = this.avatar;

    const isMe = this.isMe;

    if (posts) {
      posts.forEach((elem) => {
        elem.createdAt = remakeCreatedAt(elem.createdAt);
      });
    }

    this.postsElement.innerHTML += template({
      posts,
      avatar,
      staticUrl,
      author,
      isMe,
    });

    this.subscribeUser = document.getElementById(`subscribe-${this.userId}`);
    this.sendMessageUser = document.getElementById(
      `send-message-${this.userId}`,
    );

    if (this.subscribeUser !== null) {
      this.subscribeUser.addEventListener("click", () => {
        if (
          this.subscribeUser.classList.contains(
            "subscribed-to-options__button-subscribe",
          )
        ) {
          this.eventBus.emit("clickedSubscribe", this.userId);
        } else {
          this.eventBus.emit("clickedUnsubscribe", this.userId);
        }
      });
    }

    const publishButton = document.getElementById("publish-post-button");

    if (publishButton !== null) {
      publishButton.addEventListener("click", () => {
        const content = document.getElementById("user-news-content").value;

        this.eventBus.emit("clickedPublishPost", {
          content: content,
          attachments: null,
        });
      });
    }

    const trashes = document.querySelectorAll(".post-author__trash-basket-img");

    trashes.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.eventBus.emit("clickedDeletePost", elem.dataset.id);
      });
    });
  }

  /**
   * Pusblishes the new post on page
   * @param {PostInfo} postInfo - The info about user's posts
   * @return {void}
   */
  postPublishedSuccess({ post, author }) {
    document.getElementById("user-news-content").value = "";

    const template = Handlebars.templates["profilePost.hbs"];
    const avatar = this.avatar;

    const isMe = this.isMe;
    const posts = [post];

    this.postsElement.innerHTML =
      template({
        posts,
        avatar,
        staticUrl,
        author,
        isMe,
      }) + this.postsElement.innerHTML;

    const trashes = document.querySelectorAll(".post-author__trash-basket-img");

    trashes.forEach((elem) => {
      elem.addEventListener("click", async () => {
        this.eventBus.emit("clickedDeletePost", elem.dataset.id);
      });
    });
  }

  /**
   * Deletes post from the page
   * @param {number} postId - The ID of post deleted
   * @return {void}
   */
  postDeletedSuccess(postId) {
    const post = document.getElementById(`post${postId}`);

    if (post !== null) {
      post.remove();
    }
  }

  /**
   * Shows that mistake called
   * @return {void}
   */
  serverErrored() {
    const serverError = document.getElementById("server-error-500");

    serverError.classList.remove("server-error-500");
  }
}

export default ProfileView;
