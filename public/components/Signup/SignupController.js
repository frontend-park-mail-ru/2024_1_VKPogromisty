import SignupModel from "./SignupModel.js";
import SignupView from "./SingupView.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = [
  "attemptSignup",
  "signupSuccess",
  "receiveSignupResult",
  "serverError",
];

/**
 * SignupController - класс для связи SignupModel и SignupView.
 * @property {SignupView} signupView - SignupView - класс для работы с визуалом на странице.
 * @property {SignupModel} signupModel - SignupModel - класс для обработки данных, общения с бэком.
 */
export default class SignupController {
  #signupView;
  #signupModel;

  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {UserState} userState - The current state of session's user
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, userState, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.#signupModel = new SignupModel(this.eventBus, userState, webSocket);
    this.#signupView = new SignupView(this.eventBus);

    this.eventBus.addEventListener(
      "signupSuccess",
      router.redirect.bind(router),
    );
  }

  /**
   * Renders SignupView
   * @returns {void}
   */
  renderSignupView() {
    this.#signupView.render(document.body);
  }
}
