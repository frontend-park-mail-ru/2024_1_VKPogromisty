export class Routing {

    #config

    constructor(config) {
        this.#config = config;
    }

    redirect(url) {
        if (this.#config.paths[url] === undefined){
            console.log('path does not exist');
            return;
        }
        history.replaceState("", "", url);
        document.title = `Socio - ${this.#config.paths[url].title}`;

        this.#config.prestart.forEach((func) => {
            func();
        })

        this.#config.paths[url].func();

        this.#config.poststart.forEach((func) => {
            func();
        });

    }

}
