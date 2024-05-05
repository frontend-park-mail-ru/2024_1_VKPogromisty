import "./reset.css";
import { Routing } from "./routes.js";
import runtime from "serviceworker-webpack5-plugin/lib/runtime.js";
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
import SettingsController from "./components/Settings/SettingsController.js";
import CSRFProtection from "./components/CSRFProtection.js";
import GroupController from "./components/Group/GroupController.js";
import { renderLanding } from "./components/Landing/landing.js";

document.addEventListener("DOMContentLoaded", async () => {
  if ("serviceWorker" in navigator) {
    runtime.register();
  }

  const webSocket = new WSocket(WEBSOCKET_URL);
  const router = new Routing();
  const signupController = new SignupController(router, webSocket);
  const profileController = new ProfileController(router, webSocket);
  const loginController = new LoginController(router, webSocket);
  const friendsController = new FriendsController(router, webSocket);
  const messengerController = new MessengerController(router, webSocket);
  const chatController = new ChatController(router, webSocket);
  const feedController = new FeedController(router, webSocket);
  const settingsController = new SettingsController(router, webSocket);
  const groupController = new GroupController(router, webSocket);

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
        path: /\/profile\/settings/,
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
        path: /\/groups/,
        func: groupController.renderGroups.bind(groupController),
        title: "Группы",
      },
      {
        path: /\/group\/(?<groupId>[0-9]+)\/settings/,
        func: groupController.renderGroupSettings.bind(groupController),
        title: "Изменить группу",
      },
      {
        path: /\/group\/(?<groupId>[0-9]+)\/admins/,
        func: groupController.renderGroupAdmins.bind(groupController),
        title: "Модераторы группы",
      },
      {
        path: /\/group\/(?<groupId>[0-9]+)/,
        func: groupController.renderGroup.bind(groupController),
        title: "Группа",
      },
      {
        path: /\/group\/create/,
        func: groupController.renderGroupCreate.bind(groupController),
        title: "Создать группу",
      },
      {
        path: /\//,
        func: renderLanding,
        akaPath: "landing",
        title: "Socio - социальная сеть",
      },
    ],
  };

  router.setConfig(config);

  const result = await CSRFProtection.updateCSRFToken();
  const currentPageUrl = window.location.pathname;
  switch (currentPageUrl) {
    case "/":
    case "/login":
    case "/signup":
      router.redirect(currentPageUrl);
      break;
    default:
      if (result) {
        await UserState.updateState();
        webSocket.openWebSocket();
        router.redirect(currentPageUrl);
      } else {
        router.redirect("/login");
      }
  }
});
