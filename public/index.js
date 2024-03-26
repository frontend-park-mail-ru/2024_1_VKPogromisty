import { PostService, AuthService, ChatService, FriendsService } from "./modules/services.js";
import { Header } from './components/Header/header.js';
import { FeedMain, FeedPost } from "./components/Feed/feed.js";
import { LoginForm } from "./components/Login/loginForm.js";
import { SignUpForm } from "./components/Signup/signup.js";
import { ProfileMain, ProfilePost } from "./components/Profile/profile.js";
import { MessengerMain } from "./components/Messenger/messenger.js";
import { ChatMain } from './components/Chat/chat.js';
import { FriendsMain } from "./components/Friends/friends.js";
import { Routing } from "./routes.js";

document.addEventListener("DOMContentLoaded", async () => {

  const config = {
    paths: [
      {
        path: /\/login/,
        func: renderLogin,
        title: 'Вход',
      },
      {
        path: /\/signup/,
        func: renderSignUp,
        title: 'Регистрация',
      },
      {
        path: /\/feed/,
        func: renderFeed,
        title: 'Новости',
      },
      {
        path: /\/profile\/([0-9].*?)/,
        func: renderProfile,
        title: 'Профиль',
      },
      {
        path: /\/messenger/,
        func: renderMessenger,
        title: 'Мессенджер',
      },
      {
        path: /\/friends/,
        func: renderFriends,
        title: 'Друзья',
      },
      {
        path: /\//,
        func: renderLogin,
        title: 'Вход',
      },
    ],
  }

  const router = new Routing(config);
  var ownUserId;

  const body = document.getElementsByTagName('body')[0];

  body
    .addEventListener('click', (event) => {
      let target = event.target;

      while (target.nodeName.toLowerCase() !== 'body') {
        if (target.nodeName.toLowerCase() === 'a') {
          event.preventDefault();

          const url = target.getAttribute('href');

          router.redirect(url);
          break;
        }
        
        target = target.parentNode;
      }
    });

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
    body.innerHTML = '';

    ownUserId = localStorage.getItem('userId');
    const feedHeader = new Header(body);
    const feedMain = new FeedMain(body);

    feedHeader.renderForm();
    feedMain.renderForm();

    //const postService = new PostService();

    //const post = new FeedPost(document.getElementById("activity"));
    //const posts = await postService.getPosts();

    //post.renderPosts(posts.body);

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        await authService.logout();
        router.redirect('/login');
      });

    document
      .getElementById('user__avatar-img')
      .addEventListener('click', async () => {
        await router.redirect(`/profile/${ownUserId}`);
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
        uploadImg.classList.remove('form__input__correct');
      });
  }

  const authService = new AuthService();
  const isAuthorized = await authService.isAuthorized();

  async function route() {
    const currentPageUrl = window.location.pathname;
    switch (currentPageUrl) {
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
        if (!isAuthorized.body) {
          router.redirect('/login');
        } else {
          await router.redirect(currentPageUrl);
        }
        return;
    }
  }

  async function renderProfile(userId) {
    body.innerHTML = '';

    const profileHeader = new Header(body);
    const profileMain = new ProfileMain(body);

    profileHeader.renderForm();
    profileMain.renderForm(userId);

    //const postService = new PostService();
    //const profilePost = new ProfilePost(document.getElementById('activity'));

    //const posts = await postService.getPosts();
    //profilePost.renderPosts(posts.body);

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        await authService.logout();
        router.redirect('/login');
      });
  }

  async function renderMessenger() {
    body.innerHTML = '';

    const messengerHeader = new Header(body);
    const messengerMain = new MessengerMain(body);

    /*
    const chatService = new ChatService();

    chats = chatService.getChats();*/
    
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

  async function renderFriends() {
    body.innerHTML = '';

    const friendsHeader = new Header(body);
    const friendsMain = new FriendsMain(body);

    friendsHeader.renderForm();

    const friendsService = new FriendsService();
    const friends = await friendsService.getFriends();

    friendsMain.renderForm(friends.body.friends);

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        await authService.logout();
        router.redirect('/login');
      });

  }

  async function renderChat() {
    body.innerHTML = '';

    const chatMain = new ChatMain(body);

    chatMain.renderForm();
  }

  document.addEventListener("navigate", route);
  route();
});
