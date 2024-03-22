import { PostService, AuthService, ChatService } from "./modules/services.js";
import { Header } from './components/Header/header.js';
import { FeedMain, FeedPost } from "./components/Feed/feed.js";
import { LoginForm } from "./components/Login/loginForm.js";
import { SignUpForm } from "./components/Signup/signup.js";
import { ProfileMain, ProfilePost } from "./components/Profile/profile.js";
import { MessengerMain } from "./components/Messenger/messenger.js";
import { ChatMain } from './components/Chat/chat.js';
import { Routing } from "./routes.js";

document.addEventListener("DOMContentLoaded", async () => {

  const config = {
    paths: {
      '/': {
        func: renderLogin,
        title: 'Login',
      },
      '/login': {
        func: renderLogin,
        title: 'Login',
      },
      '/signup': {
        func: renderSignUp,
        title: 'Signup',
      },
      '/feed': {
        func: renderFeed,
        title: 'Feed',
      },
      '/profile': {
        func: renderProfile,
        title: 'Profile',
      },
      '/messenger': {
        func: renderMessenger,
        title: 'Messenger',
      },
    },
    prestart: [
      prestart,
    ],
    poststart: [
      removeLinking,
    ],
  }

  const router = new Routing(config);

  function removeLinking() {
    document.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (event) => {
        event.preventDefault();
        if (window.location.pathname !== a.getAttribute('href')){
          router.redirect(a.getAttribute('href'));
        }
      });
    });
  }

  const body = document.getElementsByTagName('body')[0];

  function prestart() {
    body.innerHTML = '';
  }

  function renderLogin() {

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

    const feedHeader = new Header(body);
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

    document
      .getElementById('user__avatar-img')
      .addEventListener('click', async () => {
        await router.redirect('/profile');
      })
  }

  function renderSignUp() {

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
    const currentPageUrl = window.location.pathname;
    switch (currentPageUrl) {
      case '/profile':
      case '/messenger':
      case '/feed':
        if (!isAuthorized.body) {
          router.redirect('/login');
        } else {
          await router.redirect(currentPageUrl);
        }
        return;
      case '/login':
      case '/signup':
      case '/':
        if (isAuthorized.body){
          await router.redirect('/feed');
        } else {
          router.redirect(currentPageUrl);
        }
        return;
      default:
        router.redirect(currentPageUrl);
    }
  }

  async function renderProfile() {

    const profileHeader = new Header(body);
    const profileMain = new ProfileMain(body);

    profileHeader.renderForm();
    profileMain.renderForm();

    /*
    const postService = new PostService();
    const profilePost = new ProfilePost(document.getElementById('activity'));

    const posts = await postService.getPosts();
    profilePost.renderPosts(posts.body);
    */

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        await authService.logout();
        router.redirect('/login');
      });
  }

  async function renderMessenger() {
    const messengerHeader = new Header(body);
    const messengerMain = new MessengerMain(body);

    /*
    const chatService = new ChatService();

    chats = chatService.getChats();
    */
    const chats = [];
    messengerHeader.renderForm();
    messengerMain.renderForm(chats);

    document
      .querySelectorAll('.dialog')
      .forEach((elem) => {
        elem.addEventListener('click', () => {
          const chatterId = elem.getAttribute('id');
          router.redirect(`/profile/${chatterId}`);
        });
      });

  }

  async function renderChat() {
    const chatMain = new ChatMain(body);

    chatMain.renderForm();
  }

  document.addEventListener("navigate", route);
  route();
});
