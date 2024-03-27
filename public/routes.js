export class Routing {
  #config;

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

  redirect(url) {
    const foundedUrl = this.#config.paths.find(
      (elem) => elem.path.exec(url) !== null,
    );
    const slug = foundedUrl.path.exec(url)[1];

    const state = {
      title: window.location.pathname,
    };

    history.pushState(state, "", url);
    document.title = `Socio - ${foundedUrl.title}`;

    foundedUrl.func(slug);
  }
}
