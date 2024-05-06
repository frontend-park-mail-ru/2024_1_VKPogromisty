import FriendsModel from "./FriendsModel.js";
import FriendsView from "./FriendsView.js";
import EventBus from "../../MVC/EventBus.js";

const incomingEvents = [
  "readyRenderFriends",
  "readyRenderSubscribers",
  "readyRenderSubscriptions",
  "receiveOwnProfileData",
  "friendsGetSuccess",
  "subscribersGetSuccess",
  "subscriptionsGetSuccess",
  "clickedSubscribeButton",
  "addFriendSuccess",
  "unsubscribeSuccess",
  "clickedUnsubscribeButton",
  "clickedSearchFriend",
  "searchedFriendSuccess",
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
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.friendsModel = new FriendsModel(this.eventBus, router, webSocket);
    this.friendsView = new FriendsView(this.eventBus);
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
