import AdminModel from "./AdminModel.js";
import AdminView from "./AdminView.js";
import EventBus from "../../MVC/EventBus.js";

const incomingEvents = [
  "needGetAdminsList",
  "needAddAdmin",
  "needDeleteAdmin",
  "getAdminsSuccess",
  "deletesAdminSuccess",
  "addsAdminSuccess",
  "gaveIncorrectUserId",
  "serverError",
];

/**
 * AdminController - класс для связи FeedModel и FeedView.
 * @property {AdminView} AdminView - AdminView - класс для работы с визуалом на странице.
 * @property {AdminModel} AdminModel - AdminModel - класс для обработки данных, общения с бэком.
 */
class AdminController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.AdminModel = new AdminModel(this.eventBus, router, webSocket);
    this.AdminView = new AdminView(this.eventBus, router);
  }

  /**
   * Renders list of admins
   *
   * @returns {void}
   */
  renderAdminPage() {
    this.AdminView.renderAdminMain();
  }
}

export default AdminController;
