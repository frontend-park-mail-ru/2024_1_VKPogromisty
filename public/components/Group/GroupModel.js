/**
 * A PostInfo structure
 * @typedef {Object} PostInfo
 * @property {number} userId - The ID of user
 * @property {number} lastPostId - The ID of last post of current user
 */

import BaseModel from "/public/MVC/BaseModel.js";
import { GroupService, ProfileService } from "../../modules/services.js";

/**
 * GroupModel - класс для обработки данных, общения с бэком на странице профиля.
 */
class GroupModel extends BaseModel {
  /**
   * Конструктор класса GroupModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.groupService = new GroupService();
    this.profileService = new ProfileService();

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
    this.eventBus.addEventListener(
      "needGetAdminsList",
      this.getAdminsList.bind(this),
    );
    this.eventBus.addEventListener(
      "needDeleteAdmin",
      this.deleteAdmin.bind(this),
    );
    this.eventBus.addEventListener("needAddAdmin", this.addAdmin.bind(this));
    this.eventBus.addEventListener(
      "needInfoAboutAdmin",
      this.getNewAdmin.bind(this),
    );
  }

  /**
   * Gets the data of user current group
   * @param {number} groupId - The ID of group
   * @param {boolean} isSettings - Is group data need for settings
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

  /**
   * Gets groups which user subscribes to
   *
   * @param {number} userId - The ID of user
   */
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
   * Subscribes user on current group
   * @param {number} groupId - The ID of group
   * @return {void}
   */
  async subscribeToGroup({ groupId, isCreated = false }) {
    const result = await this.groupService.postSubscription(groupId);

    switch (result.status) {
      case 201:
        if (isCreated) {
          this.router.redirect(`/group/${groupId}`);
        } else {
          this.eventBus.emit("subscribedSuccess", {});
        }

        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Unsubscribes user from current group
   * @param {number} groupId - The ID of current group
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

  /**
   * Checks if user is admin of group
   *
   * @param {number} groupId - The ID of current group
   * @param {boolean} isSettings - Is this data need for settings
   */
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

  /**
   * Creates a group
   *
   * @param {string} groupName - The name of group
   * @param {string} description - The description of group
   * @param {File} avatar - The avatar of group
   */
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

  /**
   * Updates a current group
   *
   * @param {number} groupId - The ID of group
   * @param {string} groupName - The name of group
   * @param {string} description - The description of group
   * @param {File} avatar - The avatar of group
   */
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

  /**
   * Deletes current group
   *
   * @param {number} groupId - The ID of group
   */
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
   * Gets posts of group
   *
   * @param {number} groupId - The ID of group
   * @param {number} lastPostId - The ID of last rendered post
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
      case 404:
        this.eventBus.emit("getPostsSuccess", []);
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Publishes the post to group's profile
   * @param {number} groupId - The ID of group
   * @param {string} content - The text content of post
   * @param {File[]} attachments - The attachments
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
   * Searches group
   *
   * @param {string} query - The name of group
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
   * Deletes current group from session's user subscriptions
   *
   * @param {number} groupId - The ID of group
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

  /**
   * Gets list of admins
   */
  async getAdminsList(groupId) {
    const result = await this.groupService.getAdminsList(groupId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("getAdminsSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      case 403:
        this.router.redirect("/feed");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Deletes admin
   *
   * @param {number} adminId - The ID of deleted admin
   */
  async deleteAdmin({ groupId, adminId }) {
    const result = await this.groupService.deleteAdmin(groupId, adminId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("deletesAdminSuccess", adminId);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      case 403:
        this.router.redirect("/feed");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Creates new admin
   *
   * @param {number} userId - The ID of admined user
   */
  async addAdmin({ groupId, userId }) {
    const result = await this.groupService.addAdmin(groupId, userId);

    switch (result.status) {
      case 201:
        this.eventBus.emit("addsAdminSuccess", userId);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      case 403:
        this.router.redirect("/feed");
        break;
      case 404:
        this.eventBus.emit("gaveIncorrectUserId", result.body);
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Gets info about new admin
   *
   * @param {number} userId - The ID of new admin
   */
  async getNewAdmin(userId) {
    const result = await this.profileService.getOtherProfileData(userId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("gotNewAdminSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      case 403:
        this.router.redirect("/feed");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default GroupModel;
