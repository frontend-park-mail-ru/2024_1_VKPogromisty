import { PostService, AuthService } from "./modules/services.js";

const authService = new AuthService();

const result = await authService.isAuthorized();

if (!result) {
    window.location.replace('/login');
}

document.getElementById('logout-button').addEventListener('click', async () => {
    if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
        await authService.logout();
    }
    window.location.replace('/login');
});