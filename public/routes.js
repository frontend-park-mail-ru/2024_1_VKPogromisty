/**
 * Service for redirects
 * @class
 * @property {object} config - The config with paths and their callbackes
 * @method redirect - Redirects to the current page
 */
export class Routing {
  #config;

  /**
   * Creates router
   * @param {string} config - The config with paths and their callbackes
   */
  constructor(config) {
    this.#config = config;

    const body = document.body;

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
  }

  /**
   * Redirects to the current page
   * @param {string} url
   * @returns {void}
   */
  redirect(url) {
    const foundedUrl = this.#config.paths.find(
      (elem) => elem.path.exec(url) !== null,
    );
    const slugs = foundedUrl.path.exec(url).groups;

    const state = {
      title: window.location.pathname,
    };

    history.pushState(state, "", url);
    document.title = `Socio - ${foundedUrl.title}`;

    foundedUrl.func(slugs);
  }
}
