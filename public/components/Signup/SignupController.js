import SignupModel from "./SignupModel.js";
import SignupView from "./SingupView.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = ["signup", "redirectFeed", "signupAnswer"];

/**
 * SignupController - класс для связи SignupModel и SignupView.
 * @property {SignupView} signupView - SignupView - класс для работы с визуалом на странице.
 * @property {SignupModel} signupModel - SignupModel - класс для обработки данных, общения с бэком.
 * @property {Routing} router - Service for redirects
 */
export default class SignupController {
  #signupView;
  #signupModel;
  #router;

  /**
   * Creates controller
   * @param {Routing} router - The router
   */
  constructor(router) {
    this.eventBus = new EventBus(incomingEvents);
    this.#signupModel = new SignupModel(this.eventBus);
    this.#signupView = new SignupView(this.eventBus);
    this.#router = router;

    this.eventBus.addEventListener("redirectFeed", this.redirect.bind(this));
  }

  /**
   * Renders SignupView
   * @returns {void}
   */
  render() {
    this.#signupView.render(document.body);
  }

  /**
   * Redirects to the current page
   * @param {string} path - The path of current page
   * @returns {void}
   */
  redirect(path) {
    this.#router.redirect(path);
  }
}
