import { AuthService } from "../../modules/services.js";

/**
 * SignupModel - класс для обработки данных, общения с бэком.
 */
class SignupModel {
  #eventBus

  /**
   * Конструктор класса SignupModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus) {
    this.#eventBus = eventBus;
    this.#eventBus.addEventListener('signup', this.isValidForm.bind(this));
  }

    /**
   * Checks if the form is valid:
   * - Checks if the email is valid
   * - Checks if the password is valid
   * - Checks if the repeated password is the same as the password
   * - Checks if the first name is valid
   * - Checks if the last name is valid
   * - Checks if the date of birth is valid
   * @returns {Promise<boolean>}
   */
  async isValidForm({firstName, lastName, email, password, repeatPassword, dateOfBirth, avatar}) {
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

    if (result.ok) {
      const { avatar, firstName, lastName } = result.body.user;
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
    }

    this.#eventBus.emit('signupAnswer', result.ok);
  }
}

export default SignupModel;
  