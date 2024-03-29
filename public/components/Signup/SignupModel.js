import { AuthService } from "../../modules/services.js";
import BaseModel from "/public/MVC/BaseModel.js";

/**
 * SignupModel - класс для обработки данных, общения с бэком.
 */
class SignupModel extends BaseModel {
  /**
   * Конструктор класса SignupModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus) {
    super(eventBus);
    this.eventBus.addEventListener(
      "attemptSignup",
      this.isValidForm.bind(this),
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
  async isValidForm({
    firstName,
    lastName,
    email,
    password,
    repeatPassword,
    dateOfBirth,
    avatar,
  }) {
    const authService = new AuthService();

    const result = await authService.sign_up(
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
      dateOfBirth,
      avatar,
    );

    switch (result.status) {
      case 201:
        this.eventBus.emit("receiveSignupResult", true);
        break;
      case 400:
        this.eventBus.emit("receiveSignupResult", false);
        break;
      default:
        throw new Error("Unexpected error");
    }
  }
}

export default SignupModel;
