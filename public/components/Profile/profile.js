import { API_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

/**
 * Class for rendering the main feed
 * @class
 * @property {HTMLElement} #parent - The parent element
 * @method renderForm - Renders the main feed
 */
export class ProfileMain {
  #parent;
  #fullUserName;
  #userAvatar;
  #userId;

  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Updates the user, setting the full user name and the user avatar from local storage
   * @returns {void}
   */
  updateUser() {
    this.#fullUserName = `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`;
    this.#userAvatar = `${staticUrl}/${localStorage.getItem("avatar")}`;
    this.#userId = localStorage.getItem("userId");
  }

  /**
   * Renders the main feed handlebars template
   * @returns {void}
   */
  renderForm() {
    this.updateUser();
    const userAvatar = this.#userAvatar;
    const fullName = this.#fullUserName;
    const userId = this.#userId;
    const date = "1 января 2024";
    const place = "Москва";

    const template = Handlebars.templates["profileMain.hbs"];
    this.#parent.innerHTML = template({
      userAvatar,
      fullName,
      date,
      place,
      userId,
    });
  }
}

/**
 * Class for rendering the feed posts
 * @class
 * @property {HTMLElement} #parent - The parent element
 * @property {HTMLElement} #fullUserName - The full user name
 * @property {HTMLElement} #userAvatar - The user avatar
 * @method updateUser - Updates the user
 * @method renderPosts - Renders the feed posts
 */
export class ProfilePost {
  #parent;

  #fullUserName;
  #userAvatar;

  /**
   * Creates a new FeedPost
   * @param {HTMLElement} parent - The parent element
   * @returns {FeedPost}
   * @constructor
   */
  constructor(parent) {
    this.#parent = parent;
    this.updateUser;
  }

  /**
   * Updates the user, setting the full user name and the user avatar from local storage
   * @returns {void}
   */
  updateUser() {
    this.#fullUserName = `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`;
    this.#userAvatar = `${staticUrl}/${localStorage.getItem("avatar")}`;
  }

  /**
   * Renders the feed posts handlebars template
   * @param {object[]} posts - The posts to render
   * @returns {void}
   */
  renderPosts(posts) {
    const template = Handlebars.templates["profilePost.hbs"];

    this.#parent.innerHTML += template({
      posts,
      avatar,
      fullUserName,
      staticUrl,
    });
  }
}
