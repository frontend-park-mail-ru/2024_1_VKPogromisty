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
   */
  constructor(router) {
    this.eventBus = new EventBus(incomingEvents);
    this.friendsModel = new FriendsModel(this.eventBus, router);
    this.friendsView = new FriendsView(this.eventBus, router);
  }

  /**
   * Renders view with friends
   * @returns {void}
   */
  renderFriendsView() {
    this.friendsModel.getOwnProfileData("friends");
  }

  /**
   * Renders view with subscribers
   * @returns {void}
   */
  renderSubscribersView() {
    this.friendsModel.getOwnProfileData("subscribers");
  }

  /**
   * Renders view with subscriptions
   * @returns {void}
   */
  renderSubscriptionsView() {
    this.friendsModel.getOwnProfileData("subscriptions");
  }
}

export default FriendsController;
