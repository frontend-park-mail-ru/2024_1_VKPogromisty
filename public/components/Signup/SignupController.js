import SignupModel from "./SignupModel.js";
import SignupView from "./SingupView.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = [
    'signup',
    'redirectFeed',
    'signupAnswer',
];

export default class SignupController {
    #signupView
    #router

    constructor(router) {
        this.eventBus = new EventBus(incomingEvents);
        this.signupModel = new SignupModel(this.eventBus);
        this.#signupView = new SignupView(this.eventBus);
        this.#router = router;

        this.eventBus.addEventListener('redirectFeed', this.redirect.bind(this));
    }

    render() {
        this.#signupView.render(document.body);
    }

    redirect(path) {
        this.#router.redirect(path);
    }

}