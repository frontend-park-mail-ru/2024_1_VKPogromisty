import { API_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

/**
 * Class for rendering the main feed
 * @class
 * @property {HTMLElement} #parent - The parent element
 * @method renderForm - Renders the main feed
 */
export class ChatMain {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Renders the main feed handlebars template
   * @returns {void}
   */
  renderForm(messages) {
    const template = Handlebars.templates["chatMain.hbs"];
    
    this.#parent.innerHTML = template({ messages });
  }
}
