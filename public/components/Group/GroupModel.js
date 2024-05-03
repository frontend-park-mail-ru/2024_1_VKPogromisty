/**
 * A PostInfo structure
 * @typedef {Object} PostInfo
 * @property {number} userId - The ID of user
 * @property {number} lastPostId - The ID of last post of current user
 */

import BaseModel from "/public/MVC/BaseModel.js";
import { GroupService } from "../../modules/services.js";

/**
 * GroupModel - класс для обработки данных, общения с бэком на странице профиля.
 */
class GroupModel extends BaseModel {
  /**
   * Конструктор класса GroupModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   * @param {WSocket} webSocket - Текущий сокет
   */
  constructor(eventBus, router, webSocket) {
    super(eventBus);

    this.router = router;
    this.webSocket = webSocket;
    this.groupService = new GroupService();

    this.eventBus.addEventListener(
      "readyRenderGroup",
      this.getGroupData.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedSubscribe",
      this.subscribeToGroup.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedUnsubscribe",
      this.unsubscribeFromGroup.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderPosts",
      this.getPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedPublishPost",
      this.publishPost.bind(this),
    );
    this.eventBus.addEventListener(
      "readyRenderGroups",
      this.getGroups.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedSearchGroup",
      this.searchGroup.bind(this),
    );
    this.eventBus.addEventListener(
      "needCheckIsAdmin",
      this.checksIfAdmin.bind(this),
    );
    this.eventBus.addEventListener(
      "clickCreateGroup",
      this.createGroup.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedDeleteGroup",
      this.deleteGroup.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedUpdateGroup",
      this.updateGroup.bind(this),
    );
  }

  /**
   * Gets the data of user current profile
   * @param {number} groupId - The ID of user current profile
   * @return {void}
   */
  async getGroupData({ groupId, isSettings }) {
    const result = await this.groupService.getGroupData(groupId);

    switch (result.status) {
      case 200:
        if (isSettings) {
          this.eventBus.emit("receivedForSettings", result.body);
        } else {
          this.eventBus.emit("receiveGroupData", result.body);
        }
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async getGroups(userId) {
    const result = await this.groupService.getUserSubGroups(userId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("receiveGroupsData", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Subscribes on user current profile
   * @param {number} groupId - The ID of user current profile
   * @return {void}
   */
  async subscribeToGroup(groupId) {
    const result = await this.groupService.postSubscription(groupId);

    switch (result.status) {
      case 201:
        this.eventBus.emit("subscribedSuccess", {});
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Unsubscribes from user current profile
   * @param {number} groupId - The ID of user current profile
   * @return {void}
   */
  async unsubscribeFromGroup(groupId) {
    const result = await this.groupService.deleteSubscription(groupId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("unsubscribedSuccess", {});
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async checksIfAdmin({ groupId, isSettings }) {
    const result = await this.groupService.isAdmin(groupId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("checksIsAdminSuccess", {
          result: true,
          isSettings,
        });
        break;
      case 401:
        this.router.redirect("/login");
        break;
      case 403:
        this.eventBus.emit("checksIsAdminSuccess", {
          result: false,
          isSettings,
        });
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async createGroup({ groupName, description, avatar }) {
    const result = await this.groupService.createGroup(
      groupName,
      description,
      avatar,
    );

    switch (result.status) {
      case 201:
        this.eventBus.emit("groupCreatedSuccess", result.body);
        break;
      case 400:
        this.eventBus.emit("doubledNameOfGroup", {});
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async updateGroup({ groupId, groupName, description, avatar }) {
    const result = await this.groupService.updateGroup(
      groupId,
      groupName,
      description,
      avatar,
    );

    switch (result.status) {
      case 200:
        this.eventBus.emit("groupUpdatedSuccess", {});
        break;
      case 400:
        this.eventBus.emit("doubledNameOfGroup", {});
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async deleteGroup(groupId) {
    const result = await this.groupService.deleteGroup(groupId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("groupDeletedSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      case 403:
        this.router.redirect(`/group/${groupId}`);
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Unsubscribes from user current profile
   * @param {PostInfo} postInfo - The info about required posts
   * @return {void}
   */
  async getPosts({ groupId, lastPostId }) {
    const result = await this.groupService.getPosts(groupId, lastPostId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("getPostsSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Publishes the post to user's profile
   * @param {string} content - The text content of post
   * @param {File[]} attachments - The attachments
   * @return {void}
   */
  async publishPost({ groupId, content, attachments }) {
    const result = await this.groupService.publishPost(
      groupId,
      content,
      attachments,
    );

    switch (result.status) {
      case 201:
        this.eventBus.emit("publishedPostSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Searches friend
   *
   * @param {string} query - The name of friend
   */
  async searchGroup(query) {
    const result = await this.groupService.searchGroup(query);

    switch (result.status) {
      case 200:
        this.eventBus.emit("searchedGroupSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Deletes current friend from session's user friends
   * @param {number} groupId - The ID of future friend
   * @returns {void}
   */
  async deleteSubscribe(groupId) {
    const result = await this.groupService.deleteSubscription(groupId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("unsubscribeSuccess", groupId);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default GroupModel;
