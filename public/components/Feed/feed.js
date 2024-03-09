import { API_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

const sidebar = [
  {
    href: "#",
    text: "Профиль",
  },
  {
    href: "#",
    text: "Новости",
  },
  {
    href: "#",
    text: "Мессенджер",
  },
  {
    href: "#",
    text: "Друзья",
  },
  {
    href: "#",
    text: "Сообщества",
  },
  {
    href: "#",
    text: "Настройки",
  },
  {
    href: "#",
    text: "Стикеры",
  },
];

const right_sidebar = [
  {
    href: "#",
    text: "Друзья",
  },
  {
    href: "#",
    text: "Фотографии",
  },
  {
    href: "#",
    text: "Рекомендации",
  },
];

/**
 * Class for rendering the main feed
 * @class
 * @property {HTMLElement} #parent - The parent element
 * @method renderForm - Renders the main feed
 */
export class FeedMain {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Renders the main feed handlebars template
   * @returns {void}
   */
  renderForm() {
    const template = Handlebars.templates["feedMain.hbs"];
    this.#parent.innerHTML = template({ sidebar, right_sidebar });
  }
}

/**
 * Class for rendering the feed header
 * @class
 * @property {HTMLElement} #fullUserName - The full user name
 * @property {HTMLElement} #userAvatar - The user avatar
 * @property {HTMLElement} #parent - The parent element
 * @method updateUser - Updates the user
 * @method renderForm - Renders the feed header
 */
export class FeedHeader {
  #fullUserName;
  #userAvatar;

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
  }

  /**
   * Renders the feed header handlebars template
   * @returns {void}
   */
  renderForm() {
    const template = Handlebars.templates["feedHeader.hbs"];
    this.updateUser();

    const userAvatar = this.#userAvatar;
    const fullUserName = this.#fullUserName;
    this.#parent.innerHTML = template({ userAvatar, fullUserName });
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
export class FeedPost {
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
    const template = Handlebars.templates["post.hbs"];
    this.updateUser();

    const userAvatar = this.#userAvatar;
    const fullUserName = this.#fullUserName;
    this.#parent.innerHTML += template({
      posts,
      userAvatar,
      fullUserName,
      staticUrl,
    });
  }
}
