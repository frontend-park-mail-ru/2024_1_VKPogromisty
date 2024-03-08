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

/**
 * Renders the login form, 
 * changes the URL to /login
 * @returns {void}
 */
function renderLogin() {
    history.pushState("", "", "/login")
    clearHeaderMain();

    const loginForm = new LoginForm(main);

    loginForm.renderForm();

    document.getElementById("button-sign-up").addEventListener("click", () => {
        renderSignUp();
    });

    document.getElementById('button-sign-in').addEventListener('click', async () => {
        if (await loginForm.isValidForm()) {
            renderFeed();
        }
    });
}

/**
 * Renders the feed,
 * changes the URL to /feed
 * @returns {Promise<void>}
 */ 
async function renderFeed() {
    history.pushState("", "", "/feed")
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

/**
 * Renders the sign up form,
 * changes the URL to /signup
 * @returns {void}
 */
function renderSignUp() {
    history.pushState("", "", "/signup")
    clearHeaderMain();

    const signupForm = new SignUpForm(main);
    
    signupForm.renderForm();

    document.getElementById("sign-in-button").addEventListener("click", () => {
        renderLogin();
    });

    document.getElementById("submit-form").addEventListener("click", async () => {
        if (await signupForm.isValidForm()) {
            renderFeed();
        }
    });

}

const authService = new AuthService();

authService.isAuthorized().then((result) => {
    if (result.body) {
        renderFeed();
    } else {
        renderLogin();
    }
});
