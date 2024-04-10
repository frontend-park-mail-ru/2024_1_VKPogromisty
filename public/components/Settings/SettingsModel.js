import { AuthService, ProfileService } from "../../modules/services.js";
import BaseModel from "/public/MVC/BaseModel.js";

/**
 * SettingsModel - класс для обработки данных, общения с бэком.
 */
class SettingsModel extends BaseModel {
  /**
   * Конструктор класса SettingsModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {UserState} userState - Текущее состояние юзера
   * @param {WSocket} webSocket - Текущий сокет
   */
  constructor(eventBus, router, webSocket, userState) {
    super(eventBus);

    this.userState = userState;
    this.webSocket = webSocket;
    this.router = router;
    this.profileService = new ProfileService();

    this.eventBus.addEventListener(
      "clickedSaveChanges",
      this.saveChanges.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedDeleteProfile",
      this.deleteProfile.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedLogoutButton",
      this.logout.bind(this),
    );
  }

  /**
   * Checks if the form is valid:
   * - Checks if the email is valid
   * - Checks if the password is valid
   * - Checks if the repeated password is the same as the password
   * - Checks if the first name is valid
   * - Checks if the last name is valid
   * - Checks if the date of birth is valid
   * @returns {Promise<void>}
   */
  async saveChanges({
    firstName,
    lastName,
    email,
    password,
    repeatPassword,
    avatar,
  }) {
    const result = await this.profileService.updateProfileData(
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
      avatar,
      this.userState,
    );

    switch (result.status) {
      case 200:
        this.userState.avatar = result.body.avatar;
        this.userState.firstName = result.body.firstName;
        this.userState.lastName = result.body.lastName;
        this.userState.updatedAt = result.body.updatedAt;
        this.userState.email = result.body.email;
        this.eventBus.emit("changesSaved", {});
        break;
      case 400:
        this.eventBus.emit("doubledEmail", {});
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async deleteProfile() {
    const result = await this.profileService.deleteProfile(this.userState);

    switch (result.status) {
      case 204:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError");
    }
  }

  /**
   * Logouts from account
   * @return {void}
   */
  async logout() {
    const authService = new AuthService();

    const result = await authService.logout();

    switch (result.status) {
      case 200:
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default SettingsModel;
