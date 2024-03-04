import { PostService, AuthService } from "./modules/services.js";

const authService = new AuthService();

const result = await authService.isAuthorized();

if (!result) {
    window.location.replace("/login");
}

document.getElementById("logout-button").addEventListener("click", async () => {
    if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
        await authService.logout();
    }
    window.location.replace("/login");
});

document.addEventListener('DOMContentLoaded', () => {
    const userAvatar = localStorage.getItem('userAvatar');
    const userName = localStorage.getItem('userName');

    const logoImg = document.getElementById('logo_img');
    const userAvatarNews = document.getElementById('user-avatar-news');
    const userAvatarPosts = document.querySelectorAll('.user-avatar-post');
    const username = document.querySelector('.username');
    const userAvatarElement = document.querySelector('.user-avatar');

    if (userAvatar && userName) {
        logoImg.src = `../static/images/${userAvatar}`;
        userAvatarNews.src = `../static/images/${userAvatar}`;
        userAvatarPosts.forEach((avatar) => {
            avatar.src = `../static/images/${userAvatar}`;
        });
        username.textContent = userName;
        userAvatarElement.src = `../static/images/${userAvatar}`;
    }   
 });
