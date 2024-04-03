import BaseModel from "/public/MVC/BaseView.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

const rightSidebar = [
  {
    href: "#",
    text: "НОВОСТИ",
  },
  {
    href: "#",
    text: "СООБЩЕСТВА",
  },
  {
    href: "#",
    text: "ДРУЗЬЯ",
  },
  {
    href: "#",
    text: "ФОТОГРАФИИ",
  },
];

class FeedView extends BaseView {
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.template = Handlebars.templates["feedMain.hbs"];

    this.eventBus.addEventListener(
      "receiveOwnProfileData",
      this.renderMain.bind(this),
    );
    this.eventBus.addEventListener(
      "postsGetSuccess",
      this.renderPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "postPublishedSuccess",
      this.renderPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "deletePostSuccess",
      this.renderPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  renderMain({ userId, avatar, firstName, lastName, path }) {
    this.ownUserId = userId;
    this.avatar = avatar;

    if (document.getElementById("header") === null) {
      const header = new Header(document.body);

      header.renderForm({ userId, avatar, firstName, lastName });
    }

    if (document.getElementById("main") === null) {
      const main = new Main(document.body);

      main.renderForm(userId);
    }

    document.getElementById("logout-button").addEventListener("click", () => {
      this.eventBus.emit("clickedLogoutButton", {});
    });

    document
      .getElementById("server-error-500")
      .classList.add("server-error-500");

    this.mainElem = document.getElementById("activity");

    switch (path) {
      case "subscriptions":
        this.eventBus.emit("readyRenderSubscriptions", {});
        break;
      case "subscribers":
        this.eventBus.emit("readyRenderSubscribers", {});
        break;
      default:
        this.eventBus.emit("readyRenderFriends", {});
    }
  }

  renderPosts(posts) {
    const template = Handlebars.templates["feedPost.hbs"];

    const userAvatar = this.feedMain.userAvatar;
    const fullUserName = this.feedMain.fullUserName;
    this.feedMain.parent.innerHTML += template({
      posts,
      userAvatar,
      fullUserName,
      staticUrl,
    });
  }

  updateUser() {
    this.feedMain.userAvatar = `${staticUrl}/${localStorage.getItem("avatar")}`;
    this.feedMain.userId = localStorage.getItem("userId");
  }

  /**
   * Shows that mistake called
   * @return {void}
   */
  serverErrored() {
    const serverError = document.getElementById("server-error-500");

    serverError.classList.remove("server-error-500");
  }
}
export default FeedView;
