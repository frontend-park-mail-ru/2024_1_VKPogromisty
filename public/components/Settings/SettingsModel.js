import { AuthService, ProfileService } from "../../modules/services.js";
import BaseModel from "/public/MVC/BaseModel.js";
import UserState from "../UserState.js";

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
  constructor(eventBus, router, webSocket) {
    super(eventBus);

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
    );

    switch (result.status) {
      case 200:
        UserState.avatar = result.body.avatar;
        UserState.firstName = result.body.firstName;
        UserState.lastName = result.body.lastName;
        UserState.updatedAt = result.body.updatedAt;
        UserState.email = result.body.email;
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

  /**
   * Deletes profile
   */
  async deleteProfile() {
    const result = await this.profileService.deleteProfile(UserState);

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
