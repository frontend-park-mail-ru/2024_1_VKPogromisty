import "./main.scss";

const sidebar = [
  {
    href: "/feed",
    text: "Новости",
    icon: "megaphone",
  },
  {
    href: "/messenger",
    text: "Мессенджер",
    icon: "mail",
  },
  {
    href: "/community/friends",
    text: "Друзья",
    icon: "high-five",
  },
  {
    href: "/groups",
    text: "Сообщества",
    icon: "people",
  },
  {
    href: "/profile/settings",
    text: "Настройки",
    icon: "settings",
  },
  {
    href: "/stickers",
    text: "Стикеры",
    icon: "star",
  },
];

const toolbar = [
  {
    href: "/feed",
    text: "Новости",
    icon: "megaphone",
  },
  {
    href: "/messenger",
    text: "Мессенджер",
    icon: "mail",
  },
  {
    href: "/community/friends",
    text: "Друзья",
    icon: "high-five",
  },
  {
    href: "/groups",
    text: "Сообщества",
    icon: "people",
  },
  {
    href: "/stickers",
    text: "Стикеры",
    icon: "star",
  },
];

/**
 * Class for rendering the feed header
 * @class
 * @property {HTMLElement} #fullUserName - The full user name
 * @property {HTMLElement} #userAvatar - The user avatar
 * @property {HTMLElement} #parent - The parent element
 * @method updateUser - Updates the user
 * @method renderForm - Renders the feed header
 */
export class Main {
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
   * @returns {void}
   */
  renderForm(userId) {
    if (document.getElementById("main") === null) {
      const template = require("./main.hbs");

      const fullSidebar = sidebar.concat({
        href: `/profile/${userId}`,
        text: "Профиль",
        icon: "user-avatar",
      });

      this.#parent.innerHTML += template({ fullSidebar, toolbar });
    }

    document
      .getElementById("server-error-500")
      .classList.add("server-error-500");
  }
}
