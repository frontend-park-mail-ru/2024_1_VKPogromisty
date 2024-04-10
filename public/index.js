import { Routing } from "./routes.js";
import SignupController from "./components/Signup/SignupController.js";
import ProfileController from "./components/Profile/ProfileController.js";
import LoginController from "./components/Login/LoginController.js";
import FriendsController from "./components/Friends/FriendsController.js";
import UserState from "./components/UserState.js";
import MessengerController from "./components/Messenger/MessengerController.js";
import ChatController from "./components/Chat/ChatController.js";
import { WEBSOCKET_URL } from "./modules/consts.js";
import WSocket from "./components/WebSocket.js";
import FeedController from "./components/Feed/FeedController.js";
import { AuthService } from "./modules/services.js";
import SettingsController from "./components/Settings/SettingsController.js";

document.addEventListener("DOMContentLoaded", async () => {
  const userState = new UserState();
  const webSocket = new WSocket(WEBSOCKET_URL, userState);

  const router = new Routing();
  const authService = new AuthService();
  const signupController = new SignupController(router, userState, webSocket);
  const profileController = new ProfileController(router, userState, webSocket);
  const loginController = new LoginController(router, userState, webSocket);
  const friendsController = new FriendsController(router, userState, webSocket);
  const messengerController = new MessengerController(
    router,
    userState,
    webSocket,
  );
  const chatController = new ChatController(router, userState, webSocket);
  const feedController = new FeedController(router, userState, webSocket);
  const settingsController = new SettingsController(
    router,
    userState,
    webSocket,
  );

  const config = {
    paths: [
      {
        path: /\/login/,
        func: (slugs) => {
          loginController.renderLoginView(slugs);
          webSocket.closeWebSocket();
        },
        title: "Вход",
      },
      {
        path: /\/signup/,
        func: (slugs) => {
          signupController.renderSignupView(slugs);
          webSocket.closeWebSocket();
        },
        title: "Регистрация",
      },
      {
        path: /\/feed/,
        func: feedController.renderFeed.bind(feedController),
        title: "Новости",
      },
      {
        path: /\/profile\/(?<userId>[0-9]+)/,
        func: profileController.renderProfileView.bind(profileController),
        title: "Профиль",
      },
      {
        path: /\/settings/,
        func: settingsController.renderSettingsView.bind(settingsController),
        title: "Настройки",
      },
      {
        path: /\/messenger/,
        func: messengerController.renderMessengerView.bind(messengerController),
        title: "Мессенджер",
      },
      {
        path: /\/community\/(?<section>.+)/,
        func: friendsController.renderView.bind(friendsController),
        title: "Друзья",
      },
      {
        path: /\/chat\/(?<companionId>[0-9]+)/,
        func: chatController.renderChatView.bind(chatController),
        title: "Диалог",
      },
      {
        path: /\//,
        func: feedController.renderFeed.bind(feedController),
        akaPath: "feed",
        title: "Новости",
      },
    ],
  };

  router.setConfig(config);

  const result = await authService.getCSRFToken();

  const currentPageUrl = window.location.pathname;
  switch (currentPageUrl) {
    case "/login":
    case "/signup":
    case "/":
      if (result.status === 200) {
        userState.csrfToken = result.body.csrfToken;
        await userState.updateState();
        router.redirect("/feed");
      } else {
        router.redirect(currentPageUrl, false);
      }
      break;
    default:
      if (result.status === 200) {
        userState.csrfToken = result.body.csrfToken;
        await userState.updateState();
        webSocket.openWebSocket();
        router.redirect(currentPageUrl);
      } else {
        router.redirect("/login", false);
      }
  }
});
