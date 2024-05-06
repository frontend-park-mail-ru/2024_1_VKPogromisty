import { formatDayMonthYear } from "../../modules/dateRemaking.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import PostController from "../Post/PostController.js";
import BaseView from "/public/MVC/BaseView.js";
import { API_URL } from "/public/modules/consts.js";
import UserState from "../UserState.js";
import { validateName } from "/public/modules/validators.js";
import { customConfirm } from "../../modules/windows.js";
import "./group.scss";

const correct = "form__input_correct";
const validExtensions = ["webp", "jpg", "jpeg", "png", "bmp", "gif"];
const staticUrl = `${API_URL}/static`;

/**
 * A Author structure
 * @typedef {Object} Group
 * @property {string} avatar - The avatar of user
 * @property {string} createdAt - The date of creating accout
 * @property {string} name - The name of group
 * @property {number} id - The ID of current group
 * @property {string} updatedAt - The last date of updating
 * @property {string} subscribersCount - The count of subscribers
 */

/**
 * A Post structure
 * @typedef {Object} Post
 * @property {number} authorId - The ID of author
 * @property {string} createdAt - The date of creating post
 * @property {string} content - The text content of post
 * @property {number} postId - The ID of post
 * @property {string} updatedAt - The last date of updating
 * @property {File[]} attachments - The images of post
 */

/**
 * A PostInfo structure
 * @typedef {Object} PostInfo
 * @property {Author} author - The info about author of post
 * @property {Post[]} posts - The posts of current user
 */

/**
 * GroupView - класс для работы с визуалом на странице профиля.
 */
class GroupView extends BaseView {
  /**
   * Конструктор класса GroupView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.postController = new PostController(router);

    this.eventBus.addEventListener(
      "receiveGroupData",
      this.renderGroup.bind(this),
    );
    this.eventBus.addEventListener(
      "receiveProfilePosts",
      this.renderPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "subscribedSuccess",
      this.updateSubscribed.bind(this),
    );
    this.eventBus.addEventListener(
      "unsubscribedSuccess",
      this.updateUnsubscribed.bind(this),
    );
    this.eventBus.addEventListener(
      "getPostsSuccess",
      this.renderPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "publishedPostSuccess",
      this.postPublishedSuccess.bind(this),
    );
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
    this.eventBus.addEventListener(
      "receiveGroupsData",
      this.readyRenderGroups.bind(this),
    );
    this.eventBus.addEventListener(
      "searchedGroupSuccess",
      this.renderFoundGroup.bind(this),
    );
    this.eventBus.addEventListener(
      "unsubscribeSuccess",
      this.renderUnsubscribedOneOfGroup.bind(this),
    );
    this.eventBus.addEventListener(
      "checksIsAdminSuccess",
      this.gotIsAdmin.bind(this),
    );
    this.eventBus.addEventListener(
      "groupCreatedSuccess",
      this.groupCreatedSuccess.bind(this),
    );
    this.eventBus.addEventListener(
      "doubledNameOfGroup",
      this.doubledGroupName.bind(this),
    );
    this.eventBus.addEventListener(
      "groupDeletedSuccess",
      this.deletedGroup.bind(this),
    );
    this.eventBus.addEventListener(
      "receivedForSettings",
      this.renderGroupSettingsMain.bind(this),
    );
    this.eventBus.addEventListener(
      "groupUpdatedSuccess",
      this.updatedGroup.bind(this),
    );
    this.eventBus.addEventListener(
      "getAdminsSuccess",
      this.renderAdmins.bind(this),
    );
    this.eventBus.addEventListener(
      "deletesAdminSuccess",
      this.adminDeleted.bind(this),
    );
    this.eventBus.addEventListener(
      "addsAdminSuccess",
      this.adminAdded.bind(this),
    );
    this.eventBus.addEventListener(
      "gotNewAdminSuccess",
      this.renderNewAdmin.bind(this),
    );
    this.eventBus.addEventListener(
      "gaveIncorrectUserId",
      this.gaveIncorrectUserId.bind(this),
    );
  }

  /**
   * Renders main part of page with groups
   */
  renderGroups() {
    const template = require("./groupsMain.hbs");
    let { userId, avatar, firstName, lastName } = UserState;
    avatar = avatar || "default_avatar.png";

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    this.mainElement = document.getElementById("activity");

    this.mainElement.innerHTML = template({});

    this.groupElement = document.getElementById("groups");

    const searchInput = document.getElementById("search-group__input");
    const searchButton = document.getElementById("search-group__button");

    searchButton.addEventListener("click", () => {
      if (searchInput.value.trim() === "") {
        return;
      }

      this.eventBus.emit("clickedSearchGroup", searchInput.value);
    });

    let isWaitingSearch = true;
    searchInput.addEventListener("input", () => {
      if (isWaitingSearch) {
        isWaitingSearch = false;
        setTimeout(() => {
          isWaitingSearch = true;
          if (searchInput.value.trim() === "") {
            this.eventBus.emit("readyRenderGroups", userId);
            return;
          }

          this.eventBus.emit("clickedSearchGroup", searchInput.value);
        }, 500);
      }
    });

    this.eventBus.emit("readyRenderGroups", userId);
  }

  /**
   * Renders groups
   *
   * @param {Group[]} groups
   */
  readyRenderGroups(groups) {
    const template = require("./groups.hbs");

    this.groupElement.innerHTML = "";

    if (groups) {
      groups.forEach((elem) => {
        elem.avatar = elem.avatar || "default_avatar.png";
        elem.createdAt = formatDayMonthYear(elem.createdAt);
        this.groupElement.innerHTML += template({
          staticUrl,
          elem,
          isSubscribed: elem.isSubscribed,
        });
      });
    } else {
      document.getElementById("no-something").innerHTML =
        "Вы не подписаны ни на какую группу";
    }
  }

  /**
   * Unsubscribes from group
   *
   * @param {number} groupId - The ID of group
   */
  renderUnsubscribedOneOfGroup(groupId) {
    document.getElementById(`groups-field-${groupId}`)?.remove();
  }

  /**
   * Renders main part of page of current group
   *
   * @param {number} group_id - The ID of group
   */
  renderCurrentGroup(group_id) {
    this.groupId = group_id;
    const { userId, avatar, firstName, lastName } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    this.eventBus.emit("needCheckIsAdmin", {
      groupId: this.groupId,
      isSettings: false,
    });
  }

  /**
   * Checks if user scrolled enough
   */
  checksNewPosts() {
    if (
      this.feedMain.scrollHeight - this.feedMain.scrollTop <=
        2.5 * window.innerHeight &&
      !this.isAllPosts &&
      !this.isWaitPosts
    ) {
      this.eventBus.emit("readyRenderPosts", {
        groupId: this.groupId,
        lastPostId: this.lastPostId,
      });
      this.isWaitPosts = true;
    }
  }

  /**
   * Checks if user is admin
   *
   * @param {boolean} result - Is user admin
   * @param {boolean} isSettings - Is it need for the settings
   */
  gotIsAdmin({ result, isSettings }) {
    if (isSettings && !result) {
      this.router.redirect(`/group/${this.groupId}`);
      return;
    }
    this.isAdmin = result;

    this.eventBus.emit("readyRenderGroup", {
      groupId: this.groupId,
      isSettings,
    });
  }

  /**
   * Renders page of group
   *
   * @param {Group} publicGroup - The info about group
   * @param {boolean} isSubscribed - Is user subscribed to group
   */
  renderGroup({ publicGroup, isSubscribed }) {
    publicGroup.createdAt = formatDayMonthYear(publicGroup.createdAt);

    let { id, name, createdAt, avatar, subscribersCount } = publicGroup;
    avatar = avatar || "default_avatar.png";
    this.mainElement = document.getElementById("activity");
    this.groupId = id;
    this.groupAvatar = avatar;
    this.groupName = name;

    const template = require("./group.hbs");
    this.mainElement.innerHTML = template({
      staticUrl,
      avatar,
      name,
      createdAt,
      isSubscribed,
      subscribersCount,
      id,
      isAdmin: this.isAdmin,
    });

    this.postsElement = document.getElementById("posts");
    this.lastPostId = 0;
    this.isAllPosts = false;
    this.isWaitPosts = true;
    this.feedMain = document.getElementById("feed-main");

    this.subscribeGroup = document.getElementById(`subscribe-${this.groupId}`);

    this.subscribeGroup?.addEventListener("click", () => {
      if (
        this.subscribeGroup.classList.contains(
          "subscribed-to-options__button-subscribe",
        )
      ) {
        this.eventBus.emit("clickedSubscribe", { groupId: this.groupId });
      } else {
        this.eventBus.emit("clickedUnsubscribe", this.groupId);
      }
    });

    this.subsCountSpan = document.getElementById("subs-count-span");

    const newsTextarea = document.getElementById("news-content__textarea");

    newsTextarea?.addEventListener("input", () => {
      newsTextarea.style.height = "auto";
      newsTextarea.style.height = newsTextarea.scrollHeight - 4 + "px";
    });

    this.feedMain.onscroll = this.checksNewPosts.bind(this);

    const publishButton = document.getElementById("publish-post-button");
    const fileInput = document.getElementById("news__file-input");
    const fileButton = document.getElementById("news__file-button");

    fileButton?.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput?.addEventListener("change", () => {
      const files = fileInput.files;
      const imgContent = document.getElementById("news-img-content");

      imgContent.innerHTML = "";

      Array.from(files).forEach((elem) => {
        const src = URL.createObjectURL(elem);

        const img = document.createElement("img");
        img.setAttribute("src", src);
        img.classList.add("news-img-content__img", "post-content__img");

        imgContent.appendChild(img);
      });
    });

    publishButton?.addEventListener("click", () => {
      const content = document.getElementById("news-content__textarea").value;

      if (content.trim() === "" && fileInput.files.length === 0) {
        return;
      }

      this.eventBus.emit("clickedPublishPost", {
        groupId: this.groupId,
        content: content,
        attachments: fileInput.files,
      });

      document.getElementById("news-img-content").innerHTML = "";
      const textarea = document.getElementById("news-content__textarea");
      textarea.value = "";
      textarea.style.height = "60px";
      fileInput.value = null;
    });

    this.eventBus.emit("readyRenderPosts", {
      groupId: this.groupId,
      lastPostId: this.lastPostId,
    });
  }

  /**
   * Updates button of profile post if subscribed
   * @return {void}
   */
  updateSubscribed() {
    this.subscribeGroup.classList.remove(
      "subscribed-to-options__button-subscribe",
    );
    this.subscribeGroup.classList.add(
      "subscribed-to-options__button-unsubscribe",
    );
    this.subscribeGroup.innerHTML = "Отписаться";
    this.subsCountSpan.dataset.count = +this.subsCountSpan.dataset.count + 1;
    this.subsCountSpan.innerHTML =
      "Подписчики: " + this.subsCountSpan.dataset.count;
  }

  /**
   * Updates button of profile post if unsubscribed
   * @return {void}
   */
  updateUnsubscribed() {
    this.subscribeGroup.classList.remove(
      "subscribed-to-options__button-unsubscribe",
    );
    this.subscribeGroup.classList.add(
      "subscribed-to-options__button-subscribe",
    );
    this.subscribeGroup.innerHTML = "Подписаться";
    this.subsCountSpan.dataset.count = +this.subsCountSpan.dataset.count - 1;
    this.subsCountSpan.innerHTML =
      "Подписчики: " + this.subsCountSpan.dataset.count;
  }

  /**
   * Updates button of profile post if subscribed
   * @param {Post[]} posts - The info about user's posts
   * @return {void}
   */
  renderPosts(posts) {
    this.isWaitPosts = false;

    document.getElementById("posts-sceleton")?.remove();

    if (posts?.length > 0) {
      posts.forEach((elem) => {
        if (elem.postId < this.lastPostId || this.lastPostId === 0) {
          this.lastPostId = elem.postId;
        }
      });
      posts.forEach((elem) => {
        this.postController.renderPostView({
          isGroup: true,
          post: elem,
          author: {
            name: this.groupName,
            groupId: this.groupId,
            avatar: this.groupAvatar,
          },
        });
      });
    } else {
      this.isAllPosts = true;
      document
        .getElementById("no-more-posts")
        .classList.replace("no-more-posts_hidden", "no-more-posts_visible");
    }

    if (!this.isAllPosts) {
      const imgSceleton = document.createElement("img");

      imgSceleton.classList.add("sceleton-img");
      imgSceleton.setAttribute("id", "posts-sceleton");
      imgSceleton.setAttribute("src", "dist/images/loading.png");

      this.postsElement.appendChild(imgSceleton);
    }

    this.checksNewPosts();
  }

  /**
   * Pusblishes the new post on page
   * @param {Post} post - The info about user's post
   * @return {void}
   */
  postPublishedSuccess({ post }) {
    this.postController.renderPostView({
      post: post,
      author: {
        name: this.groupName,
        groupId: this.groupId,
        avatar: this.groupAvatar,
      },
      canDelete: this.isAdmin,
      publish: true,
      isGroup: true,
    });
  }

  /**
   * Renders founded of query groups
   *
   * @param {Group[]} groups
   */
  renderFoundGroup(groups) {
    const template = require("./groups.hbs");
    const noGroups = groups == null;

    document.getElementById("no-something").innerHTML = "";
    this.groupElement.innerHTML = "";

    if (!noGroups) {
      groups.forEach((elem) => {
        elem.publicGroup.avatar =
          elem.publicGroup.avatar || "default_avatar.png";
        elem.publicGroup.createdAt = formatDayMonthYear(
          elem.publicGroup.createdAt,
        );
        this.groupElement.innerHTML += template({
          staticUrl,
          elem: elem.publicGroup,
          isSubscribed: elem.isSubscribed,
        });
      });
    } else {
      document.getElementById("no-something").innerHTML = "Нет результатов";
    }
  }

  /**
   * Renders a creates group page
   */
  renderGroupCreate() {
    const { userId, avatar, firstName, lastName } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    const template = require("./groupCreate.hbs");

    this.mainElement = document.getElementById("activity");
    this.mainElement.innerHTML = template({ staticUrl });

    const groupName = document.getElementById("group-name");
    const incorrectGroupName = document.getElementById("incorrect-group-name");
    const description = document.getElementById("description-group");
    const incorrectDescription = document.getElementById(
      "incorrect-description-group",
    );
    const avatarForm = document.getElementById("avatar");
    const incorrectAvatarForm = document.getElementById("incorrect-avatar");

    groupName.addEventListener("focusout", () => {
      incorrectGroupName.classList.add(correct);

      if (!validateName(groupName.value.trim())) {
        incorrectGroupName.classList.remove(correct);
      }
    });

    description.addEventListener("focusout", () => {
      incorrectDescription.classList.add(correct);

      if (description.value.trim() === "") {
        incorrectDescription.classList.remove(correct);
      }
    });

    avatarForm.addEventListener("change", () => {
      incorrectAvatarForm.classList.add(correct);

      const file = avatarForm.files[0];
      const img = URL.createObjectURL(file);

      const typeFile = (() => {
        const parts = file.name.split(".");
        return parts[parts.length - 1];
      })();

      if (!validExtensions.includes(typeFile)) {
        incorrectAvatarForm.classList.remove(correct);
        avatarForm.files = null;
      } else {
        document.getElementById("prewatch").setAttribute("src", img);
      }
    });

    document.getElementById("accept-setting").addEventListener("click", () => {
      if (this.isValidForm()) {
        this.eventBus.emit("clickCreateGroup", {
          groupName: groupName.value,
          description: document.getElementById("description-group")?.value,
          avatar: avatarForm.files[0],
        });
      }
    });
  }

  /**
   * Renders a setting's page of group
   *
   * @param {number} groupId - The ID of group
   */
  renderGroupSettings(groupId) {
    const { userId, avatar, firstName, lastName } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });

    new Main(document.body).renderForm(userId);

    this.groupId = groupId;
    this.eventBus.emit("needCheckIsAdmin", {
      groupId: this.groupId,
      isSettings: true,
    });
  }

  /**
   * Filling inputs with group's info
   *
   * @param {Group} publicGroup - The info about group
   */
  renderGroupSettingsMain({ publicGroup }) {
    const template = require("./groupSettings.hbs");

    let { name, avatar, description } = publicGroup;
    avatar = avatar || "default_avatar.png";
    this.groupAvatar = avatar;
    this.groupName = name;
    this.description = description;

    this.mainElement = document.getElementById("activity");
    this.mainElement.innerHTML = template({
      staticUrl,
      name: this.groupName,
      avatar: this.groupAvatar,
      description: this.description,
    });

    const groupName = document.getElementById("group-name");
    const incorrectGroupName = document.getElementById("incorrect-group-name");
    const descriptionForm = document.getElementById("description-group");
    const incorrectDescription = document.getElementById(
      "incorrect-description-group",
    );
    const avatarForm = document.getElementById("avatar");
    const incorrectAvatarForm = document.getElementById("incorrect-avatar");

    groupName.addEventListener("focusout", () => {
      incorrectGroupName.classList.add(correct);

      if (!validateName(groupName.value.trim())) {
        incorrectGroupName.classList.remove(correct);
      }
    });

    descriptionForm.addEventListener("focusout", () => {
      incorrectDescription.classList.add(correct);

      if (descriptionForm.value.trim() === "") {
        incorrectDescription.classList.remove(correct);
      }
    });

    avatarForm.addEventListener("change", () => {
      incorrectAvatarForm.classList.add(correct);

      const file = avatarForm.files[0];
      const img = URL.createObjectURL(file);

      const typeFile = (() => {
        const parts = file.name.split(".");
        return parts[parts.length - 1];
      })();

      if (!validExtensions.includes(typeFile)) {
        incorrectAvatarForm.classList.remove(correct);
        avatarForm.files = null;
      } else {
        document.getElementById("prewatch").setAttribute("src", img);
      }
    });

    document.getElementById("accept-setting").addEventListener("click", () => {
      if (this.isValidForm()) {
        this.eventBus.emit("clickedUpdateGroup", {
          groupId: this.groupId,
          groupName: groupName.value,
          description: descriptionForm.value,
          avatar: avatarForm.files[0],
        });
      }
    });

    document.getElementById("cancel-setting").addEventListener("click", () => {
      groupName.value = this.groupName;
      descriptionForm.value = this.description;
      document
        .getElementById("prewatch")
        .setAttribute("src", `${staticUrl}/group-avatars/${this.groupAvatar}`);
    });

    document.getElementById("delete-setting").addEventListener("click", () => {
      customConfirm(
        (() => {
          this.eventBus.emit("clickedDeleteGroup", this.groupId);
        }).bind(this),
        "Удалить группу?",
        "Вы уверены, что хотите удалить группу?",
        "Удалить",
        "Отмена",
      );
    });
  }

  /**
   * Updates group
   */
  updatedGroup() {
    this.router.redirect(`/group/${this.groupId}`);
  }

  /**
   * Deletes group
   */
  deletedGroup() {
    this.router.redirect("/groups");
  }

  /**
   * Проверка на корректность формы при её отправлении
   *
   * @return {void}
   */
  isValidForm() {
    const groupName = document.getElementById("group-name");
    const incorrectGroupName = document.getElementById("incorrect-group-name");
    const description = document.getElementById("description-group");
    const incorrectDescription = document.getElementById(
      "incorrect-description-group",
    );
    const avatarForm = document.getElementById("avatar");
    const incorrectAvatarForm = document.getElementById("incorrect-avatar");

    incorrectGroupName.classList.add(correct);
    incorrectDescription.classList.add(correct);
    incorrectAvatarForm.classList.add(correct);

    let flag = true;

    if (!validateName(groupName.value.trim())) {
      incorrectGroupName.classList.remove(correct);
      flag = false;
    }

    if (description.value.trim() === "") {
      incorrectDescription.classList.remove(correct);
      flag = false;
    }

    const file = avatarForm.files[0];

    if (file) {
      const typeFile = (() => {
        const parts = file.name.split(".");
        return parts[parts.length - 1];
      })();

      if (!validExtensions.includes(typeFile)) {
        incorrectAvatarForm.classList.remove(correct);
        flag = false;
      }
    }

    return flag;
  }

  /**
   * Created group
   *
   * @param {number} id - The ID of group
   */
  groupCreatedSuccess({ id }) {
    this.eventBus.emit("clickedSubscribe", { groupId: id, isCreated: true });
  }

  /**
   * Shows errors in doubled name of group
   */
  doubledGroupName() {
    document.getElementById("doubled-group-name")?.remove(correct);
  }

  /**
   * Renders main part of page with list of admins
   *
   * @param {number} groupId - The ID of group
   */
  renderGroupAdminsMain(groupId) {
    const { userId, avatar, firstName, lastName } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    this.mainElem = document.getElementById("activity");
    this.groupId = groupId;

    this.eventBus.emit("needGetAdminsList", this.groupId);
  }

  /**
   * Renders list with all admins
   *
   * @param {AdminUser[]} list
   */
  renderAdmins(list) {
    const template = require("./groupAdminsMain.hbs");
    const adminTemplate = require("./admin.hbs");

    this.mainElem.innerHTML = template({});
    this.adminElem = document.getElementById("admin-list");

    list.forEach((elem) => {
      const admin = document.createElement("div");

      admin.classList.add("admin");
      admin.setAttribute("id", `admin-${elem.userId}`);
      elem.createdAt = formatDayMonthYear(elem.createdAt);
      admin.innerHTML = adminTemplate({ staticUrl, elem });

      this.adminElem.appendChild(admin);
    });

    document.querySelectorAll(".admin__delete-button").forEach((elem) => {
      elem.addEventListener("click", () => {
        this.eventBus.emit("needDeleteAdmin", {
          groupId: this.groupId,
          adminId: elem.dataset.id,
        });
      });
    });

    const adminInput = document.getElementById("admin-adding__input");

    document
      .getElementById("admin-adding__button")
      .addEventListener("click", () => {
        document
          .getElementById("incorrect-admin-adding")
          ?.classList.add(correct);
        this.eventBus.emit("needAddAdmin", {
          groupId: this.groupId,
          userId: adminInput.value,
        });
      });
  }

  /**
   * Shows that user's ID is incorrect
   */
  gaveIncorrectUserId() {
    document
      .getElementById("incorrect-admin-adding")
      ?.classList.remove(correct);
  }

  /**
   * Adds admin
   *
   * @param {number} userId - The ID of new admin
   */
  adminAdded(userId) {
    this.eventBus.emit("needInfoAboutAdmin", userId);
  }

  /**
   * Renders new admin
   *
   * @param {AdminUser} adminUser
   */
  renderNewAdmin(adminUser) {
    const adminTemplate = require("./admin.hbs");
    const newAdmin = document.createElement("div");

    newAdmin.classList.add("admin");
    newAdmin.setAttribute("id", `admin-${adminUser.User.userId}`);
    newAdmin.innerHTML = adminTemplate({ staticUrl, elem: adminUser.User });

    this.adminElem.insertBefore(newAdmin, this.adminElem.firstElementChild);

    document.querySelectorAll(".admin__delete-button").forEach((elem) => {
      elem.addEventListener("click", () => {
        this.eventBus.emit("needDeleteAdmin", {
          groupId: this.groupId,
          adminId: elem.dataset.id,
        });
      });
    });
  }

  /**
   * Deletes current admin
   *
   * @param {number} adminId
   */
  adminDeleted(adminId) {
    document.getElementById(`admin-${adminId}`)?.remove();
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

export default GroupView;
