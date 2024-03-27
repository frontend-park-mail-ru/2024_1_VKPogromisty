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
    class: "common",
  },
  {
    href: "/subscriptions",
    text: "ПОДПИСКИ",
    class: "bigger",
  },
];

/**
 * Class for rendering the main feed
 * @class
 * @property {HTMLElement} #parent - The parent element
 * @method renderForm - Renders the main feed
 */
export class SubscriptionsMain {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Renders the main feed handlebars template
   * @returns {void}
   */
  renderForm(subscriptions) {
    const template = Handlebars.templates["subscriptionsMain.hbs"];

    this.#parent.innerHTML = template({
      staticUrl,
      subscriptions,
      rightSidebar,
    });
  }
}
