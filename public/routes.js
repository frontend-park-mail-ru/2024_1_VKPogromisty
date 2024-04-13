/**
 * A direct structure
 * @typedef {Object} Direct
 * @property {RegExp} path - The path
 * @property {Function} func - The callback
 * @property {string} title - The title of the page
 */

import { ProfileService } from "./modules/services.js";

/**
 * The type of config
 * @typedef {Object} Config
 * @property {Direct[]} paths - The paths
 */

/**
 * Service for redirects
 * @class
 * @property {Config} config - The config with paths and their callbackes
 * @property {Author} userState - The current state of session's user
 * @method redirect - Redirects to the current page
 */
export class Routing {
  #config;

  /**
   * Creates router
   */
  constructor() {
    const body = document.body;
    this.profileService = new ProfileService();

    body.addEventListener(
      "click",
      (event) => {
        let target = event.target;

        while (target.nodeName.toLowerCase() !== "body") {
          if (target.nodeName.toLowerCase() === "a") {
            event.preventDefault();

            const url = target.getAttribute("href");

            if (url !== window.location.pathname) {
              this.redirect(url);
            }
            break;
          }

          target = target.parentNode;
        }
      },
      { capture: true },
    );

    window.onpopstate = (event) => {
      this.redirect(event.state.url, false);
    };
  }

  /**
   * Sets new config
   * @param {Config} config
   * @returns {void}
   */
  setConfig(config) {
    this.#config = config;
  }

  /**
   * Redirects to the current page
   * @param {string} url - The url of current page
   * @param {boolean} addToHistory - Checks if need to add to history
   * @returns {void}
   */
  redirect(url, addToHistory = true) {
    const foundedUrl = this.#config.paths.find(
      (elem) => elem.path.exec(url) !== null,
    );

    const slugs = foundedUrl.path.exec(url).groups;

    if (foundedUrl.akaPath === "feed") {
      url = "feed";
    }

    const state = {
      url: url,
    };

    if (addToHistory) {
      history.pushState(state, "", url);
    }

    document.title = `Socio - ${foundedUrl.title}`;
    document.onscroll = null;
    document.onkeydown = null;

    foundedUrl.func(slugs);
  }
}
