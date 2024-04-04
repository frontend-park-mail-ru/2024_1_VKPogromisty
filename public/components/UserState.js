import { ProfileService } from "../modules/services.js";

/**
 * Service for updating state of session's user
 * @class
 * @property {ProfileService} profileService - The config with paths and their callbackes
 * @property {number} userId - The ID of session's userr
 * @property {string} avatar - The avatar of session's user
 * @property {string} firstName - The first name of session's user
 * @property {string} lastName - The last name of session's user
 * @property {string} createdAt - The date of creating account of session's user
 * @property {string} updatedAt - The date of last updating account of session's user
 * @method updateState - updates state of user
 */
class UserState {
  /**
   * Creates an object of class UserState
   */
  constructor() {
    this.profileService = new ProfileService();
  }

  /**
   * Updates state of session's user
   *
   * @returns {Promise<Boolean>}
   */
  async updateState() {
    const result = await this.profileService.getOwnProfileData();

    switch (result.status) {
      case 200:
        this.userId = result.body.User.userId;
        this.avatar = result.body.User.avatar;
        this.firstName = result.body.User.firstName;
        this.lastName = result.body.User.lastName;
        this.createdAt = result.body.User.createdAt;
        this.updatedAt = result.body.User.updatedAt;
        return true;
      default:
        return false;
    }
  }
}

export default UserState;