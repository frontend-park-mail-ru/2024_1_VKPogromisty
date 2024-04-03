import BaseView from "../../MVC/BaseView.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

const rightSidebar = [
  {
    href: "/friends",
    id: "friends-label",
    text: "ДРУЗЬЯ",
  },
  {
    href: "/subscribers",
    id: "subscribers-label",
    text: "ПОДПИСЧИКИ",
  },
  {
    href: "/subscriptions",
    id: "subscriptions-label",
    text: "ПОДПИСКИ",
  },
];

/**
 * FriendsView - класс для работы с визуалом на странице.
 */
class FriendsView extends BaseView {
  /**
   * Конструктор класса BaseView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Роутинг с установленным конфигом
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.template = Handlebars.templates["friendsMain.hbs"];

    this.eventBus.addEventListener(
      "receiveOwnProfileData",
      this.renderMain.bind(this),
    );
    this.eventBus.addEventListener(
      "friendsGetSuccess",
      this.renderFriends.bind(this),
    );
    this.eventBus.addEventListener(
      "subscribersGetSuccess",
      this.renderSubscribers.bind(this),
    );
    this.eventBus.addEventListener(
      "subscriptionsGetSuccess",
      this.renderSubscriptions.bind(this),
    );
    this.eventBus.addEventListener(
      "addFriendSuccess",
      this.deleteSubscribe.bind(this),
    );
    this.eventBus.addEventListener(
      "unsubscribeSuccess",
      this.deleteSubscribe.bind(this),
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

  /**
   * A friends structure
   *
   * @typedef {Object} Friends - A friends structure
   *
   */

  /**
   *
   * @param {} friends
   */
  renderFriends(friends) {
    const isFriends = true;
    this.mainElem.innerHTML = this.template({
      staticUrl,
      friends,
      rightSidebar,
      isFriends,
    });

    const friendsLabel = document.getElementById("friends-label");

    friendsLabel.classList.remove("right-sidebar__a-common");
    friendsLabel.classList.add("right-sidebar__a-bigger");

    const addFriends = document.querySelectorAll(
      ".friend-ables__delete-friend-button",
    );

    addFriends.forEach((elem) => {
      elem.addEventListener("click", () => {
        const friendId = elem.dataset.id;
        this.eventBus.emit("clickedUnsubscribeButton", friendId);
      });
    });
  }

  /**
   * Рендер внутри переданного HTML элемента.
   * Переопределение в наследниках.
   *
   * @param {HTMLElement} element- HTML элемен, в который будет рендериться.
   * @return {void}
   */
  renderSubscribers(friends) {
    const isSubscribers = true;
    this.mainElem.innerHTML = this.template({
      staticUrl,
      friends,
      rightSidebar,
      isSubscribers,
    });

    const subscribersLabel = document.getElementById("subscribers-label");

    subscribersLabel.classList.remove("right-sidebar__a-common");
    subscribersLabel.classList.add("right-sidebar__a-bigger");

    const addFriends = document.querySelectorAll(
      ".friend-ables__add-friend-button",
    );

    addFriends.forEach((elem) => {
      elem.addEventListener("click", () => {
        const friendId = elem.dataset.id;
        this.eventBus.emit("clickedSubscribeButton", friendId);
      });
    });
  }

  deleteSubscribe(userId) {
    document.getElementById(`friends-field-${userId}`).remove();
  }

  /**
   * Рендер внутри переданного HTML элемента.
   * Переопределение в наследниках.
   *
   * @param {HTMLElement} element- HTML элемен, в который будет рендериться.
   * @return {void}
   */
  renderSubscriptions(friends) {
    const isSubscriptions = true;
    this.mainElem.innerHTML = this.template({
      staticUrl,
      friends,
      rightSidebar,
      isSubscriptions,
    });

    const subscriptionsLabel = document.getElementById("subscriptions-label");

    subscriptionsLabel.classList.remove("right-sidebar__a-common");
    subscriptionsLabel.classList.add("right-sidebar__a-bigger");

    const addFriends = document.querySelectorAll(
      ".friend-ables__unsubscribe-button",
    );

    addFriends.forEach((elem) => {
      elem.addEventListener("click", () => {
        const friendId = elem.dataset.id;
        this.eventBus.emit("clickedUnsubscribeButton", friendId);
      });
    });
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

export default FriendsView;
