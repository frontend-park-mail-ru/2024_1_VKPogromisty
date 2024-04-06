import BaseModel from "../../MVC/BaseModel.js";
import {
  AuthService,
  FriendsService,
  ProfileService,
  SubscribersService,
  SubscriptionsService,
} from "../../modules/services.js";

/**
 * FriendsModel - класс для обработки данных, общения с бэком.
 */
class FriendsModel extends BaseModel {
  /**
   * Конструктор класса FriendsModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Роутер с установленным конфигом
   * @param {WSocket} webSocket - Текущий сокет
   */
  constructor(eventBus, router, webSocket) {
    super(eventBus);

    this.webSocket = webSocket
    this.friendsService = new FriendsService();
    this.subscribersService = new SubscribersService();
    this.subscriptionsService = new SubscriptionsService();
    this.authService = new AuthService();
    this.profileService = new ProfileService();
    this.router = router;

    this.eventBus.addEventListener(
      "readyRenderFriends",
      this.getFriends.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderSubscribers",
      this.getSubscribers.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderSubscriptions",
      this.getSubscriptions.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedSubscribeButton",
      this.addFriend.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedUnsubscribeButton",
      this.deleteSubscribe.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedLogoutButton",
      this.logout.bind(this),
    );
  }

  /**
   * Gets friends of session's user
   * @returns {void}
   */
  async getFriends() {
    const result = await this.friendsService.getFriends();

    switch (result.status) {
      case 200:
        this.eventBus.emit("friendsGetSuccess", result.body.friends);
        break;
      case 401:
        this.webSocket.closeWebSocket();
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Gets subscribers of session's user
   * @returns {void}
   */
  async getSubscribers() {
    const result = await this.subscribersService.getSubscribers();

    switch (result.status) {
      case 200:
        this.eventBus.emit("subscribersGetSuccess", result.body.subscribers);
        break;
      case 401:
        this.webSocket.closeWebSocket();
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Gets subscriptions of session's user
   * @returns {void}
   */
  async getSubscriptions() {
    const result = await this.subscriptionsService.getSubscriptions();

    switch (result.status) {
      case 200:
        this.eventBus.emit(
          "subscriptionsGetSuccess",
          result.body.subscriptions,
        );
        break;
      case 401:
        this.webSocket.closeWebSocket();
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Adds current friend to session's user friends
   * @param {number} userId - The ID of future friend
   * @returns {void}
   */
  async addFriend(userId) {
    const result = await this.subscriptionsService.postSubscription(userId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("addFriendSuccess", userId);
        break;
      case 401:
        this.webSocket.closeWebSocket();
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Deletes current friend from session's user friends
   * @param {number} userId - The ID of future friend
   * @returns {void}
   */
  async deleteSubscribe(userId) {
    const result = await this.subscriptionsService.deleteSubscription(userId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("unsubscribeSuccess", userId);
        break;
      case 401:
        this.webSocket.closeWebSocket();
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Logouts from account
   * @return {void}
   */
  async logout() {
    const result = await this.authService.logout();

    switch (result.status) {
      case 200:
      case 401:
        this.webSocket.closeWebSocket();
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default FriendsModel;
