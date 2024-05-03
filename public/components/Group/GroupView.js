import { formatDayMonthYear } from "../../modules/dateRemaking.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import PostController from "../Post/PostController.js";
import BaseView from "/public/MVC/BaseView.js";
import { API_URL } from "/public/modules/consts.js";
import UserState from "../UserState.js";
import { validateName } from "/public/modules/validators.js";
import "./group.scss";

const correct = "form__input_correct";
const validExtensions = ["webp", "jpg", "jpeg", "png", "bmp", "gif"];
const staticUrl = `${API_URL}/static`;

/**
 * A Author structure
 * @typedef {Object} Author
 * @property {string} avatar - The avatar of user
 * @property {string} createdAt - The date of creating accout
 * @property {string} dateOfBirth - The date of birth current user
 * @property {string} email - The email of current user
 * @property {string} firstName - The first name of current user
 * @property {string} lastName - The last name of current user
 * @property {number} userId - The ID of current user
 * @property {string} updatedAt - The last date of updating
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
  }

  renderGroups() {
    const template = require("./groupsMain.hbs");
    const { userId, avatar, firstName, lastName } = UserState;

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

    searchInput.addEventListener("input", () => {
      if (searchInput.value.trim() === "") {
        this.eventBus.emit("readyRenderGroups", userId);
        return;
      }

      this.eventBus.emit("clickedSearchGroup", searchInput.value);
    });

    this.eventBus.emit("readyRenderGroups", userId);
  }

  readyRenderGroups(groups) {
    const template = require("./groups.hbs");

    this.groupElement.innerHTML = "";

    if (groups) {
      groups.forEach((elem) => {
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

  renderUnsubscribedOneOfGroup(groupId) {
    document.getElementById(`groups-field-${groupId}`)?.remove();
  }

  /**
   * Renders header and sidebar of page
   * @param {number} group_id - The ID of session's user
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
      document.body.scrollHeight - window.scrollY <= 2.5 * window.innerHeight &&
      !this.isAllPosts &&
      !this.isWaitPosts
    ) {
      this.eventBus.emit("readyRenderPosts", {
        userId: this.groupId,
        lastPostId: this.lastPostId,
      });
      this.isWaitPosts = true;
    }
  }

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
   * Renders header and sidebar of page
   * @param {UserInfo} userInfo - The info about session's user
   */

  /**
   * Renders user's profile
   * @param {ProfileInfo} profileInfo - The info of profile's user
   */
  renderGroup({ publicGroup, isSubscribed }) {
    publicGroup.createdAt = formatDayMonthYear(publicGroup.createdAt);

    const { id, name, createdAt, avatar, subscribersCount } = publicGroup;
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

    this.subscribeGroup = document.getElementById(`subscribe-${this.groupId}`);

    this.subscribeGroup?.addEventListener("click", () => {
      if (
        this.subscribeGroup.classList.contains(
          "subscribed-to-options__button-subscribe",
        )
      ) {
        this.eventBus.emit("clickedSubscribe", this.groupId);
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

    document.onscroll = this.checksNewPosts.bind(this);

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
   * @param {PostInfo} postInfo - The info about user's posts
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
          canDelete: this.isAdmin,
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
  }

  /**
   * Pusblishes the new post on page
   * @param {PostInfo} postInfo - The info about user's posts
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

  renderFoundGroup(groups) {
    const template = require("./groups.hbs");
    const noGroups = groups == null;

    document.getElementById("no-something").innerHTML = "";
    this.groupElement.innerHTML = "";

    if (!noGroups) {
      groups.forEach((elem) => {
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

  renderGroupSettingsMain({ publicGroup }) {
    const template = require("./groupSettings.hbs");

    const { name, avatar, description } = publicGroup;
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
      this.eventBus.emit("clickedDeleteGroup", this.groupId);
    });
  }

  updatedGroup() {
    this.router.redirect(`/group/${this.groupId}`);
  }

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

  groupCreatedSuccess({ id }) {
    this.router.redirect(`/group/${id}`);
  }

  doubledGroupName() {
    document.getElementById("doubled-group-name")?.remove(correct);
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
