import { PostService, AuthService } from "./modules/services.js";

const authService = new AuthService();

const result = await authService.isAuthorized();

if (!result) {
    window.location.replace('/login');
}

const postService = new PostService();

document.getElementById('logout-button').addEventListener('click', async () => {
    if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
        await authService.logout();
    }
    window.location.replace('/login');
});

document.addEventListener('load', async () => {
    const result = await postService.getPosts();
    console.log(result);
});