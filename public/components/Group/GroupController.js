import GroupModel from "./GroupModel.js";
import GroupView from "./GroupView.js";
import EventBus from "../../MVC/EventBus.js";

const incomingEvents = [
  "receiveGroupData",
  "receiveProfilePosts",
  "receiveOwnProfileData",
  "readyRenderGroup",
  "clickedSubscribe",
  "clickedUnsubscribe",
  "subscribedSuccess",
  "unsubscribedSuccess",
  "readyRenderPosts",
  "getPostsSuccess",
  "clickedPublishPost",
  "clickedDeletePost",
  "postDeleteSuccess",
  "publishedPostSuccess",
  "clickedUpdatePost",
  "postUpdateSuccess",
  "readyRenderGroups",
  "receiveGroupsData",
  "clickedSearchGroup",
  "searchedGroupSuccess",
  "clickedUnsubscribeButton",
  "unsubscribeSuccess",
  "needCheckIsAdmin",
  "checksIsAdminSuccess",
  "clickCreateGroup",
  "groupCreatedSuccess",
  "doubledNameOfGroup",
  "clickedUpdateGroup",
  "groupUpdatedSuccess",
  "clickedDeleteGroup",
  "groupDeletedSuccess",
  "receivedForSettings",
  "needGetAdminsList",
  "getAdminsSuccess",
  "needDeleteAdmin",
  "deletesAdminSuccess",
  "addsAdminSuccess",
  "gaveIncorrectUserId",
  "needAddAdmin",
  "serverError",
];

/**
 * GroupController - класс для связи ProfileModel и ProfileView.
 * @property {ProfileView} ProfileView - ProfileView - класс для работы с визуалом на странице.
 * @property {ProfileModel} ProfileModel - ProfileModel - класс для обработки данных, общения с бэком.
 */
class GroupController {
  /**
   * Creates controller
   * @param {Routing} router - The router
   * @param {WSocket} webSocket - The current WebSocket
   */
  constructor(router, webSocket) {
    this.eventBus = new EventBus(incomingEvents);
    this.groupModel = new GroupModel(this.eventBus, router, webSocket);
    this.groupView = new GroupView(this.eventBus, router);
  }

  /**
   * Renders groups which user subscribes to
   * @returns {void}
   */
  renderGroups() {
    this.groupView.renderGroups();
  }

  /**
   * Renders page of current group
   * @param {number} - The ID of group to render
   */
  renderGroup({ groupId }) {
    this.groupView.renderCurrentGroup(groupId);
  }

  /**
   * Renders form for creating new group
   */
  renderGroupCreate() {
    this.groupView.renderGroupCreate();
  }

  /**
   * Renders settings to change group data
   * @param {number} groupId - The ID of group to change
   */
  renderGroupSettings({ groupId }) {
    this.groupView.renderGroupSettings(groupId);
  }

  renderGroupAdmins({ groupId }) {
    this.groupView.renderGroupAdminsMain(groupId);
  }
}

export default GroupController;
