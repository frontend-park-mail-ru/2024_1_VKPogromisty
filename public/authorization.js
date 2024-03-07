import { AuthService } from "./modules/services.js";
import { LoginForm } from "./components/Login/loginForm.js";

const authService = new AuthService();

const result = await authService.isAuthorized();

if (result.body) {
  window.location.replace("/feed");
}

const loginForm = new LoginForm(document.getElementById('main'));

loginForm.renderForm();
