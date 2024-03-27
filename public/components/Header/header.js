import { API_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

/**
 * Class for rendering the feed header
 * @class
 * @property {HTMLElement} #fullUserName - The full user name
 * @property {HTMLElement} #userAvatar - The user avatar
 * @property {HTMLElement} #parent - The parent element
 * @method updateUser - Updates the user
 * @method renderForm - Renders the feed header
 */
export class Header {
  #fullUserName;
  #userAvatar;
  #userId;

  #parent;

  /**
   * Creates a new FeedHeader
   * @param {HTMLElement} parent - The parent element
   * @returns {FeedHeader}
   * @constructor
   */
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
   * Renders the feed header handlebars template
   * @returns {void}
   */
  renderForm() {
    const template = Handlebars.templates["header.hbs"];
    this.updateUser();

    const userAvatar = this.#userAvatar;
    const fullUserName = this.#fullUserName;
    const userId = this.#userId;
    this.#parent.innerHTML += template({ userAvatar, fullUserName, userId });
  }
}
