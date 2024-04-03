import {
  AuthService,
  FriendsService,
  SubscribersService,
  SubscriptionsService,
} from "./modules/services.js";
import { Header } from "./components/Header/header.js";
import { FeedMain } from "./components/Feed/feed.js";
import { MessengerMain } from "./components/Messenger/messenger.js";
import { Routing } from "./routes.js";
import { SubscribersMain } from "./components/Subscribers/subscribers.js";
import { SubscriptionsMain } from "./components/Subscriptions/subscriptions.js";
import { Main } from "./components/Main/main.js";
import SignupController from "./components/Signup/SignupController.js";
import ProfileController from "./components/Profile/ProfileController.js";
import LoginController from "./components/Login/LoginController.js";
import FeedController from "./components/Feed/FeedController.js";

document.addEventListener("DOMContentLoaded", async () => {
  const router = new Routing();
  const signupController = new SignupController(router);
  const profileController = new ProfileController(router);
  const loginController = new LoginController(router);
  const feedController=new FeedController(router);

  const config = {
    paths: [
      {
        path: /\/login/,
        func: loginController.renderLoginView.bind(loginController),
        title: "Вход",
      },
      {
        path: /\/signup/,
        func: signupController.renderSignupView.bind(signupController),
        title: "Регистрация",
      },
      {
        path: /\/feed/,
        func: feedController.renderFeedView.bind(feedController),
        title: "Новости",
      },
      {
        path: /\/profile\/(?<userId>[0-9]+)/,
        func: profileController.renderProfileView.bind(profileController),
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

  const body = document.body;

  router.setConfig(config);

  async function renderFeed() {
    const main = document.getElementById("main");
    const header = document.getElementById("header");

    if (header === null) {
      const feedHeader = new Header(body);
      feedHeader.renderForm();
    }

    if (main === null) {
      const feedMain = new Main(body);
      feedMain.renderForm();
    }

    const feedMain = new FeedMain(document.getElementById("activity"));

    feedMain.renderForm();

    const ownUserId = localStorage.getItem("userId");

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

  async function renderMessenger() {
    const main = document.getElementById("main");
    const header = document.getElementById("header");

    if (header === null) {
      const subscribersHeader = new Header(body);
      subscribersHeader.renderForm();
    }

    if (main === null) {
      const messengerMain = new Main(body);
      messengerMain.renderForm();
    }

    const messengerMain = new MessengerMain(
      document.getElementById("activity"),
    );

    messengerMain.renderForm();

    /*
    const chatService = new ChatService();

    chats = chatService.getChats();*/

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

    if (header === null) {
      const subscribersHeader = new Header(body);
      subscribersHeader.renderForm();
    }

    if (main === null) {
      const friendsMain = new Main(body);
      friendsMain.renderForm();
    }

    const friendsMain = new FriendsMain(document.getElementById("activity"));

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

    if (header === null) {
      const subscribersHeader = new Header(body);
      subscribersHeader.renderForm();
    }

    if (main === null) {
      const friendsMain = new Main(body);
      friendsMain.renderForm();
    }

    const subscribersMain = new SubscribersMain(
      document.getElementById("activity"),
    );
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

    if (header === null) {
      const subscribersHeader = new Header(body);
      subscribersHeader.renderForm();
    }

    if (main === null) {
      const friendsMain = new Main(body);
      friendsMain.renderForm();
    }

    const subscriptionsMain = new SubscriptionsMain(
      document.getElementById("activity"),
    );

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
