import BaseView from "../../MVC/BaseView.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "/public/modules/consts.js";
import { remakeDateOfBirth } from "../../modules/dateRemaking.js";

/**
 * A Friend structure
 *
 * @typedef {Object} Friend
 * @property {string} avatar - The avatar of current friend
 * @property {string} createdAt - The date of creating friend's account
 * @property {string} dateOfBirth - The date of birth current friend
 * @property {string} email - The email of current friend
 * @property {string} firstName - The first name of current friend
 * @property {string} lastName - The last name of current friend
 * @property {string} updatedAt - The last profile updating of current friend
 * @property {number} userId - The ID of friend among users
 */

/**
 * A MainFriends structure
 *
 * @typedef {Object} MainFriends
 * @property {string} avatar - The avatar of session's user
 * @property {number} userId - The ID of session's user
 * @property {string} firstName - The first name of session's user
 * @property {string} lastName - The last name of session's user
 * @property {string} path - The next path of page
 */

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
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  /**
   * Renders the main block of page
   *
   * @param {MainFriends} mainFriends - The main info about page
   */
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
   * Renders page with friends of session's user
   *
   * @param {Friend[]} friends
   */
  renderFriends(friends) {
    const isFriends = true;
    const noFriends = friends == null;

    if (!noFriends) {
      friends.forEach((elem) => {
        elem.dateOfBirth = remakeDateOfBirth(elem.dateOfBirth);
      });
    }

    this.mainElem.innerHTML = this.template({
      staticUrl,
      friends,
      rightSidebar,
      isFriends,
      noFriends,
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
   * Renders page with subscribers of session's users
   * @param {Friends} friends
   */
  renderSubscribers(friends) {
    const isSubscribers = true;
    const noFriends = friends == null;

    if (!noFriends) {
      friends.forEach((elem) => {
        elem.dateOfBirth = remakeDateOfBirth(elem.dateOfBirth);
      });
    }

    this.mainElem.innerHTML = this.template({
      staticUrl,
      friends,
      rightSidebar,
      isSubscribers,
      noFriends,
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

  /**
   * Deletes a friend/subscriber/subscription of current user from the page
   *
   * @param {number} userId
   */
  deleteSubscribe(userId) {
    document.getElementById(`friends-field-${userId}`).remove();
  }

  /**
   * Renders page with subscriptions of session's users
   * @param {Friends} friends
   */
  renderSubscriptions(friends) {
    const isSubscriptions = true;
    const noFriends = friends == null;

    if (!noFriends) {
      friends.forEach((elem) => {
        elem.dateOfBirth = remakeDateOfBirth(elem.dateOfBirth);
      });
    }

    this.mainElem.innerHTML = this.template({
      staticUrl,
      friends,
      rightSidebar,
      isSubscriptions,
      noFriends,
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
