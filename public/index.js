import { AuthService } from "./modules/services.js";
import { Header } from "./components/Header/header.js";
import { FeedMain } from "./components/Feed/feed.js";
import { MessengerMain } from "./components/Messenger/messenger.js";
import { Routing } from "./routes.js";
import { Main } from "./components/Main/main.js";
import SignupController from "./components/Signup/SignupController.js";
import ProfileController from "./components/Profile/ProfileController.js";
import LoginController from "./components/Login/LoginController.js";
import FriendsController from "./components/Friends/FriendsController.js";
import UserState from "./components/UserState.js";

document.addEventListener("DOMContentLoaded", async () => {
  const userState = new UserState();

  const router = new Routing();
  const signupController = new SignupController(router, userState);
  const profileController = new ProfileController(router, userState);
  const loginController = new LoginController(router, userState);
  const friendsController = new FriendsController(router, userState);

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
        func: renderFeed,
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
        path: /\/community\/(?<section>.+)/,
        func: friendsController.renderView.bind(friendsController),
        title: "Друзья",
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
        router.redirect(`/profile/${ownUserId}`);
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
          await userState.updateState();
          router.redirect("/feed");
        } else {
          router.redirect(currentPageUrl);
        }
        return;
      default:
        if (!isAuthorized.body) {
          router.redirect("/login");
        } else {
          await userState.updateState();
          router.redirect(currentPageUrl);
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

  document.addEventListener("navigate", route);
  route();
});
