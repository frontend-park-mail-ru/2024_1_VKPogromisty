import { API_URL } from "/public/modules/consts.js";
import "./header.scss";

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

/**
 * An info in Header
 * @typedef {Object} HeaderInfo
 * @property {number} userId - The ID of session's user
 * @property {string} firstName - The first name of session's user
 * @property {string} lastName - The last name of session's user
 * @property {string} avatar - The avatar of session's user
 */
export class Header {
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
   * Renders the feed header handlebars template
   *
   * @param {HeaderInfo} headerInfo - Info in header
   * @returns {void}
   */
  renderForm({ userId, firstName, lastName, avatar }) {
    document.onscroll = null;
    if (!document.getElementById("header")) {
      const template = require("./header.hbs");
      avatar = avatar || "default_avatar.webp";

      this.#parent.innerHTML = template({
        avatar,
        firstName,
        lastName,
        userId,
        staticUrl,
      });
    }
  }
}
