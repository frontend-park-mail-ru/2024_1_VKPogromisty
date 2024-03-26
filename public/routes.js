export class Routing {

    #config

    constructor(config) {
        this.#config = config;
    }

    redirect(url) {
        let idUrl = -1;
        let slug;

        this.#config.paths.forEach((elem, id) => {
            if (idUrl === -1){
                const answer = elem.path.exec(url);
                if (answer !== null) {
                    idUrl = id;
                    slug = answer[1];
                }
            }
        });

        history.pushState("", "", url);
        document.title = `Socio - ${this.#config.paths[idUrl].title}`;

        this.#config.paths[idUrl].func(slug);
    }

}