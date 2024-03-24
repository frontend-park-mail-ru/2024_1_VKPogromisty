export class Routing {

    #config

    constructor(config) {
        this.#config = config;
    }

    redirect(url) {
        let slugs = [];
        let foundedUrl = 'nothing';
        Object.keys(this.#config.paths).find((elem) => {
            foundedUrl = elem;
            let flag = true;
            let urlParts = url.split('/');
            let pathParts = elem.split('/');
            if (urlParts.length === pathParts.length){
                for (let i = 0; i < pathParts.length; ++i) {
                    if (pathParts[i][0] === '{') {
                        if (urlParts[i] === undefined){
                            break;
                        } else {
                            slugs.push(urlParts[i]);
                        }
                    } else {
                        if (pathParts[i] !== urlParts[i]){
                            flag = false;
                            break;
                        }
                    }
                }
            } else {
                flag = false;
            }
            if (!flag) {
                slugs = [];
                foundedUrl = 'nothing';
            }
            return flag;
        });

        if (foundedUrl === 'nothing'){
            console.log('path does not exist');
            return;
        }
        history.replaceState("", "", url);
        document.title = `Socio - ${this.#config.paths[foundedUrl].title}`;

        this.#config.prestart.forEach((func) => {
            func();
        })

        this.#config.paths[foundedUrl].func(...slugs);

        this.#config.poststart.forEach((func) => {
            func();
        });

    }

}