import { API_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

const rightSidebar = [
  {
    href: "/friends",
    text: "ДРУЗЬЯ",
    class: "common",
  },
  {
    href: "/subscribers",
    text: "ПОДПИСЧИКИ",
    class: "bigger",
  },
  {
    href: "/subscriptions",
    text: "ПОДПИСКИ",
    class: "common",
  },
];

/**
 * Class for rendering the main feed
 * @class
 * @property {HTMLElement} #parent - The parent element
 * @method renderForm - Renders the main feed
 */
export class SubscribersMain {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Renders the main feed handlebars template
   * @returns {void}
   */
  renderForm(subscribers) {
    const template = Handlebars.templates["subscribersMain.hbs"];

    this.#parent.innerHTML = template({
      staticUrl,
      subscribers,
      rightSidebar,
    });
  }
}
