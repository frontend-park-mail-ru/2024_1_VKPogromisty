import BaseView from "../../MVC/BaseView.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "/public/modules/consts.js";
import { formatDayMonthYear } from "../../modules/dateRemaking.js";
import UserState from "../UserState.js";
import "./friends.scss";

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
   * @param {UserState} userState - Текущее состояние юзера
   */
  constructor(eventBus) {
    super(eventBus);

    this.template = require("./friendsMain.hbs");

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
      "searchedFriendSuccess",
      this.renderFoundFriend.bind(this),
    );
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  /**
   * Renders the main block of page
   *
   * @param {string} path - The certain path
   */
  renderMain(path) {
    const { userId, avatar, firstName, lastName } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    this.mainElem = document.getElementById("activity");

    if (!document.getElementById("friends")) {
      this.mainElem.innerHTML = this.template({
        rightSidebar,
      });
    }

    this.friendElem = document.getElementById("friends");

    const searchInput = document.getElementById("search-friend__input");
    const searchButton = document.getElementById("search-friend__button");

    searchButton.addEventListener("click", () => {
      if (searchInput.value.trim() === "") {
        return;
      }

      this.eventBus.emit("clickedSearchFriend", searchInput.value);
    });

    searchInput.addEventListener("input", () => {
      if (searchInput.value.trim() === "") {
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
        return;
      }

      this.eventBus.emit("clickedSearchFriend", searchInput.value);
    });

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
    const template = require("./friends.hbs");
    const isFriends = true;
    const noFriends = friends.length === 0;

    document.getElementById("no-something").innerHTML = "";
    this.friendElem.innerHTML = "";

    if (!noFriends) {
      friends.forEach((elem) => {
        elem.dateOfBirth = formatDayMonthYear(elem.dateOfBirth);
        this.friendElem.innerHTML += template({
          staticUrl,
          elem,
          isFriends,
        });
      });
    } else {
      document.getElementById("no-something").innerHTML = "У вас нет друзей";
    }

    const friendsLabel = document.getElementById("friends-label");

    friendsLabel.classList.remove("right-sidebar__a_common");
    friendsLabel.classList.add("right-sidebar__a_bigger");

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
   * @param {Friend[]} friends
   */
  renderSubscribers(friends) {
    const template = require("./friends.hbs");
    const isSubscribers = true;
    const noFriends = friends.length === 0;

    document.getElementById("no-something").innerHTML = "";
    this.friendElem.innerHTML = "";

    if (!noFriends) {
      friends.forEach((elem) => {
        elem.dateOfBirth = formatDayMonthYear(elem.dateOfBirth);
        this.friendElem.innerHTML += template({
          staticUrl,
          elem,
          isSubscribers,
        });
      });
    } else {
      document.getElementById("no-something").innerHTML =
        "У вас нет подписчиков";
    }

    const subscribersLabel = document.getElementById("subscribers-label");

    subscribersLabel.classList.remove("right-sidebar__a_common");
    subscribersLabel.classList.add("right-sidebar__a_bigger");

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
   * @param {Friend[]} friends
   */
  renderSubscriptions(friends) {
    const template = require("./friends.hbs");
    const isSubscriptions = true;
    const noFriends = friends.length === 0;

    document.getElementById("no-something").innerHTML = "";
    this.friendElem.innerHTML = "";

    if (!noFriends) {
      friends.forEach((elem) => {
        elem.dateOfBirth = formatDayMonthYear(elem.dateOfBirth);
        this.friendElem.innerHTML += template({
          staticUrl,
          elem,
          isSubscriptions,
        });
      });
    } else {
      document.getElementById("no-something").innerHTML =
        "Вы ни на кого не подписаны";
    }

    const subscriptionsLabel = document.getElementById("subscriptions-label");

    subscriptionsLabel.classList.remove("right-sidebar__a_common");
    subscriptionsLabel.classList.add("right-sidebar__a_bigger");

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

  renderFoundFriend(people) {
    const template = require("./friends.hbs");
    const isSubscribers = true;
    const noFriends = people == null;

    document.getElementById("no-something").innerHTML = "";
    this.friendElem.innerHTML = "";

    if (!noFriends) {
      people.forEach((elem) => {
        elem.dateOfBirth = formatDayMonthYear(elem.dateOfBirth);
        this.friendElem.innerHTML += template({
          staticUrl,
          elem,
          isSubscribers,
        });
      });
    } else {
      document.getElementById("no-something").innerHTML = "Нет результатов";
    }
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
