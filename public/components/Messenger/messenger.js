import { API_URL } from "/public/modules/consts.js";
import { Sidebar } from "../Sidebar/sidebar.js";

const staticUrl = `${API_URL}/static`;

/**
 * Class for rendering the main feed
 * @class
 * @property {HTMLElement} #parent - The parent element
 * @method renderForm - Renders the main feed
 */
export class MessengerMain {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Renders the main feed handlebars template
   * @returns {void}
   */
  renderForm(chats) {
    const template = Handlebars.templates["messengerMain.hbs"];
    this.#parent.innerHTML += template({ chats });

    const sidebar = new Sidebar(document.getElementById("sidebar"));

    sidebar.renderSidebar();
  }
}
