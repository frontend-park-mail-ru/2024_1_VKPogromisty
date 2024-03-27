import { API_URL } from "/public/modules/consts.js";

const sidebar = [
    {
      href: "/feed",
      text: "Новости",
    },
    {
      href: "/messenger",
      text: "Мессенджер",
    },
    {
      href: "/friends",
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
  #userId;

  /**
   * Creates a new FeedHeader
   * @param {HTMLElement} parent - The parent element
   * @returns {FeedHeader}
   * @constructor
   */
  constructor(parent) {
    this.#parent = parent;
    this.#userId = localStorage.getItem("userId");
  }

  /**
   * Renders the feed header handlebars template
   * @returns {void}
   */
  renderForm() {
    const template = Handlebars.templates["main.hbs"];
    const userId = this.#userId;

    const fullSidebar = sidebar.concat({
      href: `/profile/${userId}`,
      text: "Профиль",
    });

    this.#parent.innerHTML += template({ fullSidebar });
  }
}
