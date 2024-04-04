import FriendsModel from "./FriendsModel.js";
import FriendsView from "./FriendsView.js";
import EventBus from "./public/MVC/EventBus.js";

const incomingEvents = [
  "readyRenderFriends",
  "readyRenderSubscribers",
  "readyRenderSubscriptions",
  "receiveOwnProfileData",
  "friendsGetSuccess",
  "subscribersGetSuccess",
  "subscriptionsGetSuccess",
  "clickedLogoutButton",
  "clickedSubscribeButton",
  "addFriendSuccess",
  "unsubscribeSuccess",
  "clickedUnsubscribeButton",
  "serverError",
];

/**
 * FriendsController - класс для связи FriendsModel и ProfileView.
 * @property {FriendsView} FriendsView - FriendsView - класс для работы с визуалом на странице.
 * @property {FriendsModel} FriendsModel - FriendsModel - класс для обработки данных, общения с бэком.
 */
class FriendsController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {UserState} userState - The current state of session's user
   */
  constructor(router, userState) {
    this.eventBus = new EventBus(incomingEvents);
    this.friendsModel = new FriendsModel(this.eventBus, router);
    this.friendsView = new FriendsView(this.eventBus, userState);
  }

  /**
   * Renders view with certain path
   * @param {string} section - The certain path
   * @returns {void}
   */
  renderView({ section }) {
    this.friendsView.renderMain(section);
  }
}

export default FriendsController;
