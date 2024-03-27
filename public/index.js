import {
  AuthService,
  FriendsService,
  SubscribersService,
  SubscriptionsService,
} from "./modules/services.js";
import { Header } from "./components/Header/header.js";
import { FeedMain } from "./components/Feed/feed.js";
import { LoginForm } from "./components/Login/loginForm.js";
import { SignUpForm } from "./components/Signup/signup.js";
import { ProfileMain } from "./components/Profile/profile.js";
import { MessengerMain } from "./components/Messenger/messenger.js";
import { FriendsMain } from "./components/Friends/friends.js";
import { Routing } from "./routes.js";
import { SubscribersMain } from "./components/Subscribers/subscribers.js";
import { SubscriptionsMain } from "./components/Subscriptions/subscriptions.js";

document.addEventListener("DOMContentLoaded", async () => {
  const config = {
    paths: [
      {
        path: /\/login/,
        func: renderLogin,
        title: "Вход",
      },
      {
        path: /\/signup/,
        func: renderSignUp,
        title: "Регистрация",
      },
      {
        path: /\/feed/,
        func: renderFeed,
        title: "Новости",
      },
      {
        path: /\/profile\/([0-9].*?)/,
        func: renderProfile,
        title: "Профиль",
      },
      {
        path: /\/messenger/,
        func: renderMessenger,
        title: "Мессенджер",
      },
      {
        path: /\/friends/,
        func: renderFriends,
        title: "Друзья",
      },
      {
        path: /\/subscribers/,
        func: renderSubscribers,
        title: "Подписчики",
      },
      {
        path: /\/subscriptions/,
        func: renderSubscriptions,
        title: "Подписки",
      },
      {
        path: /\//,
        func: renderFeed,
        title: "Новости",
      },
    ],
  };

  const router = new Routing(config);

  const body = document.body;

  function renderLogin() {
    const loginForm = new LoginForm(body);

    loginForm.renderForm();

    document
      .getElementById("button-sign-in")
      .addEventListener("click", async () => {
        if (await loginForm.isValidForm()) {
          await router.redirect("/feed");
        }
      });
  }

  async function renderFeed() {
    const main = document.getElementById("main");
    const header = document.getElementById("header");

    if (main !== null) {
      main.remove();
    }

    if (header === null) {
      const subscribersHeader = new Header(body);
      subscribersHeader.renderForm();
    }

    const ownUserId = localStorage.getItem("userId");
    const feedMain = new FeedMain(body);

    feedMain.renderForm();

    //const postService = new PostService();

    //const post = new FeedPost(document.getElementById("activity"));
    //const posts = await postService.getPosts();

    //post.renderPosts(posts.body);

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        await authService.logout();
        router.redirect("/login");
      });

    document
      .getElementById("user__avatar-img")
      .addEventListener("click", async () => {
        await router.redirect(`/profile/${ownUserId}`);
      });
  }

  function renderSignUp() {
    const signupForm = new SignUpForm(body);

    signupForm.renderForm();

    const uploadImg = document.getElementById("sign-up-upload-img");

    document
      .getElementById("button-sign-up")
      .addEventListener("click", async () => {
        if (await signupForm.isValidForm()) {
          router.redirect("/feed");
        }
      });

    document.getElementById("avatar").addEventListener("change", () => {
      uploadImg.classList.remove("form__input__correct");
    });
  }

  const authService = new AuthService();
  const isAuthorized = await authService.isAuthorized();

  async function route() {
    const currentPageUrl = window.location.pathname;
    switch (currentPageUrl) {
      case "/login":
      case "/signup":
      case "/":
        if (isAuthorized.body) {
          await router.redirect("/feed");
        } else {
          router.redirect(currentPageUrl);
        }
        return;
      default:
        if (!isAuthorized.body) {
          router.redirect("/login");
        } else {
          await router.redirect(currentPageUrl);
        }
        return;
    }
  }

  async function renderProfile(userId) {
    const main = document.getElementById("main");
    const header = document.getElementById("header");

    if (main !== null) {
      main.remove();
    }

    if (header === null) {
      const subscribersHeader = new Header(body);
      subscribersHeader.renderForm();
    }
    const profileMain = new ProfileMain(body);

    profileMain.renderForm(userId);

    //const postService = new PostService();
    //const profilePost = new ProfilePost(document.getElementById('activity'));

    //const posts = await postService.getPosts();
    //profilePost.renderPosts(posts.body);

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        await authService.logout();
        router.redirect("/login");
      });
  }

  async function renderMessenger() {
    const main = document.getElementById("main");
    const header = document.getElementById("header");

    if (main !== null) {
      main.remove();
    }

    if (header === null) {
      const subscribersHeader = new Header(body);
      subscribersHeader.renderForm();
    }

    const messengerMain = new MessengerMain(body);

    /*
    const chatService = new ChatService();

    chats = chatService.getChats();*/

    const chats = [];

    messengerMain.renderForm(chats);

    document.querySelectorAll(".dialog").forEach((elem) => {
      elem.addEventListener("click", () => {
        const chatterId = elem.getAttribute("id");
        router.redirect(`/profile/${chatterId}`);
      });
    });
  }

  async function renderFriends() {
    const main = document.getElementById("main");
    const header = document.getElementById("header");

    if (main !== null) {
      main.remove();
    }

    if (header === null) {
      const subscribersHeader = new Header(body);
      subscribersHeader.renderForm();
    }

    const friendsMain = new FriendsMain(body);

    const friendsService = new FriendsService();
    const friends = await friendsService.getFriends();

    if (friends.ok) {
      friendsMain.renderForm(friends.body.friends);
    } else {
      friendsMain.renderForm([]);
    }

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        await authService.logout();
        router.redirect("/login");
      });
  }

  async function renderSubscribers() {
    const main = document.getElementById("main");
    const header = document.getElementById("header");

    if (main !== null) {
      main.remove();
    }

    if (header === null) {
      const subscribersHeader = new Header(body);
      subscribersHeader.renderForm();
    }

    const subscribersMain = new SubscribersMain(body);
    const subscribersService = new SubscribersService();
    const subscribers = await subscribersService.getSubscribers();

    if (subscribers.ok) {
      subscribersMain.renderForm(subscribers.body.subscribers);
    } else {
      subscribersMain.renderForm([]);
    }

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        await authService.logout();
        router.redirect("/login");
      });
  }

  async function renderSubscriptions() {
    const main = document.getElementById("main");
    const header = document.getElementById("header");

    if (main !== null) {
      main.remove();
    }

    if (header === null) {
      const subscribersHeader = new Header(body);
      subscribersHeader.renderForm();
    }

    const subscriptionsMain = new SubscriptionsMain(body);

    const subscriptionsService = new SubscriptionsService();
    const subscriptions = await subscriptionsService.getSubscriptions();

    if (subscriptions.ok) {
      subscriptionsMain.renderForm(subscriptions.body.subscriptions);
    } else {
      subscriptionsMain.renderForm([]);
    }

    document
      .getElementById("logout-button")
      .addEventListener("click", async () => {
        await authService.logout();
        router.redirect("/login");
      });
  }

  document.addEventListener("navigate", route);
  route();
});
