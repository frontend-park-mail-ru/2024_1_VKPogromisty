import { PostService, AuthService } from "./modules/services.js";
import { FeedHeader, FeedMain, FeedPost } from "./components/Feed/feed.js";
import { LoginForm } from "./components/Login/loginForm.js";
import { SignUpForm } from "./components/Signup/signup.js";

const main = document.getElementById('main');
const header = document.getElementById('header');

function clearHeaderMain() {
    header.innerHTML = '';
    main.innerHTML = '';
}

async function renderLogin() {
    clearHeaderMain();

    const loginForm = new LoginForm(main);

    loginForm.renderForm();

    document.getElementById("button-sign-up").addEventListener("click", () => {
        renderSignUp();
    });

    document.getElementById('button-sign-in').addEventListener('click', async () => {
        if (loginForm.isValidForm()) {
            renderFeed();
        }
    });
}

async function renderFeed() {
    clearHeaderMain();

    const postService = new PostService();
    const feedHeader = new FeedHeader(header);
    const feedMain = new FeedMain(main);

    feedHeader.renderForm();
    feedMain.renderForm();

    const post = new FeedPost(document.getElementById("activity"));
    const posts = await postService.getPosts();

    post.renderPosts(posts.body);

    document.getElementById("logout-button").addEventListener("click", async () => {
        if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
          await authService.logout();
          renderLogin();
        }
    });
}

async function renderSignUp() {
    clearHeaderMain();

    const signupForm = new SignUpForm(main);
    
    signupForm.renderForm();

    document.getElementById("sign-in-button").addEventListener("click", () => {
        renderLogin();
    });

    document.getElementById("submit-form").addEventListener("click", async () => {
        if (signupForm.isValidForm()) {
            renderFeed();
        }
    });

}

const authService = new AuthService();

const result = await authService.isAuthorized();

if (result.body) {
    renderFeed();
} else {
    renderLogin();
}