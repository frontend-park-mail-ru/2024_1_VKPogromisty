import BaseModel from "../../MVC/BaseModel.js";
import { AuthService } from "../../modules/services.js";

class LoginModel extends BaseModel {
  constructor(eventBus) {
    super(eventBus);
    this.eventBus.addEventListener("attemptLogin", this.isValidForm.bind(this));
  }

  async isValidForm({ email, password }) {
    const authService = new AuthService();

    const result = await authService.login(email, password);

    switch (result.status) {
      case 200:
        this.eventBus.emit("receiveLoginResult", true);
        break;
      case 401:
        this.eventBus.emit("receiveLoginResult", false);
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default LoginModel;
