import LoginView from "./LoginView.js";
import LoginModel from "./LoginModel.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = [
  "attemptLogin",
  "loginSuccess",
  "receiveLoginResult",
  "serverError",
];

/**
 * LoginController - класс для связи LoginModel и LoginView.
 * @property {LoginView} loginView - LoginView - класс для работы с визуалом на странице.
 * @property {LoginModel} loginModel - LoginModel - класс для обработки данных, общения с бэком.
 */
export default class LoginController {
  #loginView;
  #loginModel;

  /**
   * Создаёт контроллер
   * @param {Routing} router - Объект класса роутер
   * @param {UserState} userState - Текущее состояние юзера
   * @param {WSocket} webSocket - Текущий сокет
   */
  constructor(router, userState, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.#loginModel = new LoginModel(this.eventBus, userState, webSocket);
    this.#loginView = new LoginView(this.eventBus);

    this.eventBus.addEventListener(
      "loginSuccess",
      router.redirect.bind(router),
    );
  }

  /**
   * Рендерит LoginView
   * @returns {void}
   */
  renderLoginView() {
    this.#loginView.render(document.body);
  }
}
