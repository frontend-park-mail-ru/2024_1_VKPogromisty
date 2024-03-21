export class Routing {

    #config

    constructor(config) {
        this.#config = config;
    }

    redirect(url) {
        if (this.#config[url] === undefined){
            console.log('path does not exist');
            return;
        }
        history.replaceState("", "", url);
        this.#config[url]();
    }

}
