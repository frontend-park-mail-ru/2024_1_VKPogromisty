import BaseModel from "../../MVC/BaseModel.js";
import { AuthService, FriendsService, ProfileService, SubscribersService, SubscriptionsService } from "../../modules/services.js";

/**
 * FriendsModel - класс для обработки данных, общения с бэком.
 */
class FriendsModel extends BaseModel {
  /**
   * Конструктор класса FriendsModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Роутер с установленным конфигом
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.friendsService = new FriendsService();
    this.subscribersService = new SubscribersService();
    this.subscriptionsService = new SubscriptionsService();
    this.authService = new AuthService();
    this.profileService = new ProfileService();
    this.router = router;

    this.eventBus.addEventListener('readyRenderFriends', this.getFriends.bind(this));
    this.eventBus.addEventListener('readyRenderSubscribers', this.getSubscribers.bind(this));
    this.eventBus.addEventListener('readyRenderSubscriptions', this.getSubscriptions.bind(this));
    this.eventBus.addEventListener('clickedSubscribeButton', this.addFriend.bind(this));
    this.eventBus.addEventListener('clickedUnsubscribeButton', this.deleteSubscribe.bind(this));
  }

  /**
   * Gets the data of user current session
   * @param {string} path - Path to the next page
   * @return {void}
   */
  async getOwnProfileData(path) {
    const resultOwnProfile = await this.profileService.getOwnProfileData();

    resultOwnProfile.body.User['path'] = path;

    switch (resultOwnProfile.status) {
      case 200:
        this.eventBus.emit("receiveOwnProfileData", resultOwnProfile.body.User);
        break;
      case 401:
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Gets friends of session's user
   * @returns {void}
   */
  async getFriends() {
    const result = await this.friendsService.getFriends();

    switch (result.status) {
      case 200:
        this.eventBus.emit('friendsGetSuccess', result.body.friends);
        break;
      default:
        this.eventBus.emit('serverError', {});
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
        this.eventBus.emit('subscribersGetSuccess', result.body.subscribers);
        break;
      default:
        this.eventBus.emit('serverError', {});
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
        this.eventBus.emit('subscriptionsGetSuccess', result.body.subscriptions);
        break;
      default:
        this.eventBus.emit('serverError', {});
    }
  }

  /**
   * Adds current friend to session's user friends
   * @param {number} userId - The ID of future friend
   * @returns {void}
   */
  async addFriend(userId) {
    const result = await this.subscriptionsService.postSubscription(userId);

    switch(result.status) {
      case 200:
        this.eventBus.emit('addFriendSuccess', userId);
        break;
      default:
        this.eventBus.emit('serverError', {});
    }
  }

  /**
   * Deletes current friend from session's user friends
   * @param {number} userId - The ID of future friend
   * @returns {void}
   */
  async deleteSubscribe(userId) {
    const result = await this.subscriptionsService.deleteSubscription(userId);

    switch(result.status) {
      case 204:
        this.eventBus.emit('unsubscribeSuccess', userId);
        break;
      default:
        this.eventBus.emit('serverError', {});
    }
  }

  /**
   * Logouts from account
   * @return {void}
   */
  async logout() {
    const result = await this.authService.logout();

    switch (result.status) {
      case 204:
        this.router.redirect('/login');
        break;
      default:
        this.eventBus.emit('serverError', {});
    }
  }
}

export default FriendsModel;
