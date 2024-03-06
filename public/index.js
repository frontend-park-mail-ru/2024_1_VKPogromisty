window.location.replace('/login');

import {AuthService, PostService} from "./modules/services.js";
import { LoginForm } from "./components/loginForm.js";

const authService = new AuthService();

const main = document.getElementById('main');

function renderLogin() {
    const loginForm = new LoginForm(main);
    loginForm.renderForm();
}

renderLogin();