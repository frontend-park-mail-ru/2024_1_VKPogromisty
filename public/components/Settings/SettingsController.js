import SettingsModel from "./SettingsModel.js";
import SettingsView from "./SettingsView.js";
import EventBus from "../../MVC/EventBus.js";

const incomingEvents = [
  "clickedSaveChanges",
  "changesSaved",
  "clickedLogoutButton",
  "clickedDeleteProfile",
  "doubledEmail",
  "serverError",
];

/**
 * SettingsController - класс для связи SettingsModel и SettingsView.
 * @property {ProfileView} SettingsView - SettingsView - класс для работы с визуалом на странице.
 * @property {ProfileModel} SettingsModel - SettingsModel - класс для обработки данных, общения с бэком.
 */
class SettingsController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.settingsModel = new SettingsModel(this.eventBus, router, webSocket);
    this.settingsView = new SettingsView(this.eventBus, router);
  }

  /**
   * Renders SettingsView
   * @returns {void}
   */
  renderSettingsView() {
    this.settingsView.renderSettingsMain();
  }
}

export default SettingsController;
