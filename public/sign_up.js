import { AuthService } from "./modules/services.js";
import { SignUpForm } from "./components/Signup/signup.js";

const authService = new AuthService();

const result = await authService.isAuthorized();

if (result.body) {
  window.location.replace("/feed");
}

const signupForm = new SignUpForm(document.getElementById('main'));

signupForm.renderForm();
