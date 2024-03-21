import { PostService, AuthService } from "./modules/services.js";
import { FeedHeader, FeedMain, FeedPost } from "./components/Feed/feed.js";
import { LoginForm } from "./components/Login/loginForm.js";
import { SignUpForm } from "./components/Signup/signup.js";
import { Routing } from "./routes.js";

document.addEventListener("DOMContentLoaded", async () => {

  const config = {
    '/login': renderLogin,
    '/signup': renderSignUp,
    '/feed': renderFeed
  }

  const router = new Routing(config);

  document.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', (event) => {
      event.preventDefault();
      router.redirect(a.getAttribute('href'));
    });
  });

  const body = document.getElementsByTagName('body')[0];

  function renderLogin() {
    body.innerHTML = '';

    document.title = 'Socio - Login';

    const loginForm = new LoginForm(body);

    loginForm.renderForm();

    document
      .getElementById("button-sign-in")
      .addEventListener("click", async () => {
        if (await loginForm.isValidForm()) {
          await router.redirect('/feed');
        }
      });
  }

  async function renderFeed() {
    body.innerHTML = '';

    document.title = 'Socio - Feed';

    const feedHeader = new FeedHeader(body);
    const feedMain = new FeedMain(body);

    feedHeader.renderForm();
    feedMain.renderForm();

    const postService = new PostService();

    const post = new FeedPost(document.getElementById("activity"));
    const posts = await postService.getPosts();

    post.renderPosts(posts.body);

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        await authService.logout();
        router.redirect('/login');
      });
  }

  function renderSignUp() {
    body.innerHTML = '';

    document.title = 'Socio - Signup';

    const signupForm = new SignUpForm(body);

    signupForm.renderForm();

    const uploadImg = document.getElementById('sign-up-upload-img');

    document
      .getElementById("button-sign-up")
      .addEventListener("click", async () => {
        if (await signupForm.isValidForm()) {
          router.redirect('/feed');
        }
      });

    document
      .getElementById('avatar')
      .addEventListener('change', () => {
        uploadImg.classList.remove('correct');
      });
  }

  const authService = new AuthService();
  const isAuthorized = await authService.isAuthorized();

  async function route() {
    if (isAuthorized.body) {
      await router.redirect('/feed');
    } else {
      const currentPageUrl = window.location.pathname;
      if (currentPageUrl === "/signup") {
        router.redirect('/signup');
      } else {
        router.redirect('/login');
      }
    }
  }

  document.addEventListener("navigate", route);
  route();
});
