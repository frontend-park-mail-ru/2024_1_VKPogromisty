import { API_URL } from "/public/modules/consts.js";
import { Sidebar } from "../Sidebar/sidebar.js";

const staticUrl = `${API_URL}/static`;

const rightSidebar = [
  {
    href: "/friends",
    text: "ДРУЗЬЯ",
    class: "bigger",
  },
  {
    href: "/subscribers",
    text: "ПОДПИСЧИКИ",
    class: "common",
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
export class FriendsMain {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Renders the main feed handlebars template
   * @returns {void}
   */
  renderForm(friends) {
    const template = Handlebars.templates["friendsMain.hbs"];

    this.#parent.innerHTML += template({ staticUrl, friends, rightSidebar });

    const sidebar = new Sidebar(document.getElementById("sidebar"));

    sidebar.renderSidebar();
  }
}
