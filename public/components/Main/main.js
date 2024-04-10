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
    href: "/community/friends",
    text: "Друзья",
  },
  {
    href: "/groups",
    text: "Сообщества",
  },
  {
    href: "/settings",
    text: "Настройки",
  },
  {
    href: "/stickers",
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
      const template = Handlebars.templates["main.hbs"];

      const fullSidebar = sidebar.concat({
        href: `/profile/${userId}`,
        text: "Профиль",
      });

      this.#parent.innerHTML += template({ fullSidebar });
    }

    document
      .getElementById("server-error-500")
      .classList.add("server-error-500");
  }
}
