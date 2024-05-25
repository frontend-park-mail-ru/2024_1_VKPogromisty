import "./main.scss";

const sidebar = [
  {
    href: "/feed/news",
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
    href: "/stickers/all",
    text: "Стикеры",
    icon: "stickers",
  },
  {
    href: "/profile/settings",
    text: "Настройки",
    icon: "settings",
  },
];

const toolbar = [
  {
    href: "/feed/news",
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
    href: "/stickers/all",
    text: "Стикеры",
    icon: "stickers",
  },
  {
    href: "/profile/settings",
    text: "Настройки",
    icon: "settings",
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

    const feedMain = document.getElementById("feed-main");
    const postMain = document.getElementById("post-main");
    feedMain.scrollTop = 0;
    feedMain.onscroll = null;
    document.getElementById("activity").classList.remove("activity_invisible");
    document.getElementById("post-main").classList.add("post-main_invisible");
    postMain.innerHTML = "";
    document.getElementById("toolbar").classList.remove("toolbar_invisible");

    document
      .getElementById("server-error-500")
      .classList.add("server-error-500");
  }
}
