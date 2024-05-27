import { ProfileService } from "./modules/services.js";
import { renderNotFound } from "./components/404/404.js";

/**
 * A direct structure
 * @typedef {Object} Direct
 * @property {RegExp} path - The path
 * @property {Function} func - The callback
 * @property {string} title - The title of the page
 */

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

const restrictedPaths = ["/login", "/signup"];

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
            if (target.classList.contains("news-file-content__a")) {
              break;
            }
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

    if (foundedUrl.akaPath === "landing" && window.location.pathname !== "/") {
      document.title = "Not Found";
      if (addToHistory) {
        history.pushState({ url: url }, "", url);
      }
      renderNotFound();
      return;
    }

    const state = {
      url: url,
    };

    if (addToHistory && restrictedPaths.indexOf(history.state?.url) === -1) {
      history.pushState(state, "", url);
    } else if (addToHistory) {
      history.replaceState(state, "", url);
    }

    document.title = `Socio - ${foundedUrl.title}`;
    document.onkeydown = null;

    foundedUrl.func(slugs);
  }
}
