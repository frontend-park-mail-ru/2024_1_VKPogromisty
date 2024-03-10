import { PostService, AuthService } from "./modules/services.js";
import { FeedHeader, FeedMain, FeedPost } from "./components/Feed/feed.js";
import { LoginForm } from "./components/Login/loginForm.js";
import { SignUpForm } from "./components/Signup/signup.js";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("main");
  const header = document.getElementById("header");

  function clearHeaderMain() {
    header.innerHTML = "";
    main.innerHTML = "";
  }

  function renderLogin() {
    history.replaceState("", "", "/login");
    clearHeaderMain();

    const loginForm = new LoginForm(main);

    loginForm.renderForm();

    document
      .getElementById("button-sign-up")
      .addEventListener("click", (event) => {
        event.preventDefault();
        renderSignUp();
      });

    document
      .getElementById("button-sign-in")
      .addEventListener("click", async () => {
        if (await loginForm.isValidForm()) {
          renderFeed();
        }
      });
  }

  async function renderFeed() {
    history.replaceState("", "", "/feed");
    clearHeaderMain();

    const postService = new PostService();
    const feedHeader = new FeedHeader(header);
    const feedMain = new FeedMain(main);

    feedHeader.renderForm();
    feedMain.renderForm();

    const post = new FeedPost(document.getElementById("activity"));
    const posts = await postService.getPosts();

    post.renderPosts(posts.body);

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
          await authService.logout();
          renderLogin();
        }
      });
  }

  function renderSignUp() {
    history.replaceState("", "", "/signup");
    clearHeaderMain();

    const signupForm = new SignUpForm(main);

    signupForm.renderForm();

    document
      .getElementById("button-sign-in")
      .addEventListener("click", (event) => {
        event.preventDefault();
        renderLogin();
      });

    document
      .getElementById("button-sign-up")
      .addEventListener("click", async () => {
        if (await signupForm.isValidForm()) {
          renderFeed();
        }
      });
  }

  const authService = new AuthService();
  const isAuthorized = await authService.isAuthorized();

  async function route() {
    if (isAuthorized.body) {
      await renderFeed();
    } else {
      const currentPageUrl = window.location.pathname;
      if (currentPageUrl === "/signup") {
        renderSignUp();
      } else {
        renderLogin();
      }
    }
  }

  document.addEventListener("navigate", route);
  route();
});
