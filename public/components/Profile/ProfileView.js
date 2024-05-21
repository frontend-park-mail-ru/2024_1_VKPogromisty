import { formatDayMonthYear } from "../../modules/dateRemaking.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import PostController from "../Post/PostController.js";
import BaseView from "/public/MVC/BaseView.js";
import { API_URL } from "/public/modules/consts.js";
import UserState from "../UserState.js";
import { customConfirm } from "../../modules/windows.js";
import { buildComponent, appendChildren } from "../createComponent.js";
import "./profile.scss";

const imageTypes = ["png", "jpg", "jpeg", "webp", "gif"];
const staticUrl = `${API_URL}/static`;
const typeFile = (file) => {
  const parts = file.name.split(".");
  return parts[parts.length - 1];
};

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
 * A UserInfo structure
 * @typedef {Object} UserInfo
 * @property {number} userId - The ID of user
 * @property {string} firstName - The first name of session's user
 * @property {string} lastName - The first name of session's user
 * @property {string} avatar - The file path of avatar of session's user
 */

/**
 * A ProfileInfo structure
 * @typedef {Object} ProfileInfo
 * @property {UserInfo} User - The info about profile's user
 * @property {boolean} isSubscribedTo - Is the session's user a subscriber of profile's user
 * @property {boolean} isSubscriber - Is the profile's user a subscriber of session's user
 */

/**
 * ProfileView - класс для работы с визуалом на странице профиля.
 */
class ProfileView extends BaseView {
  /**
   * Конструктор класса ProfileView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   * @param {UserState} userState - Объект класса UserState
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.postController = new PostController(router);

    this.eventBus.addEventListener(
      "receiveOwnProfileData",
      this.renderProfileMain.bind(this),
    );
    this.eventBus.addEventListener(
      "receiveProfileData",
      this.renderProfile.bind(this),
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
  }

  /**
   * Renders header and sidebar of page
   * @param {number} user_id - The ID of session's user
   */
  renderProfileMain(user_id) {
    this.userId = user_id;
    const { userId, avatar, firstName, lastName } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    this.eventBus.emit("readyRenderProfile", this.userId);
  }

  /**
   * Checks if user scrolled enough
   */
  checksNewPosts() {
    if (
      this.feedMain.scrollHeight - this.feedMain.scrollTop <=
        3 * window.innerHeight &&
      !this.isAllPosts &&
      !this.isWaitPosts
    ) {
      this.eventBus.emit("readyRenderPosts", {
        userId: this.userId,
        lastPostId: this.lastPostId,
      });
      this.isWaitPosts = true;
    }
  }

  /**
   * Renders header and sidebar of page
   * @param {UserInfo} userInfo - The info about session's user
   */

  /**
   * Renders user's profile
   * @param {ProfileInfo} profileInfo - The info of profile's user
   */
  renderProfile({ User, isSubscribedTo, isSubscriber }) {
    User.dateOfBirth = formatDayMonthYear(User.dateOfBirth);

    let { userId, firstName, lastName, dateOfBirth, avatar } = User;
    avatar = avatar || "default_avatar.png";
    this.mainElement = document.getElementById("activity");
    this.isSubscriber = isSubscriber;
    const isMe = (this.isMe = Number(this.userId) === Number(UserState.userId));

    const template = require("./profileMain.hbs");
    this.mainElement.innerHTML = template({
      avatar,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth.toLowerCase(),
      userId,
      staticUrl,
      isMe,
      isSubscribedTo,
      isSubscriber,
    });

    this.postsElement = document.getElementById("posts");
    this.lastPostId = 0;
    this.isAllPosts = false;
    this.isWaitPosts = true;
    this.feedMain = document.getElementById("feed-main");

    const newsTextarea = document.getElementById("news-content__textarea");

    if (newsTextarea) {
      newsTextarea.addEventListener("input", () => {
        newsTextarea.style.height = "auto";
        newsTextarea.style.height = newsTextarea.scrollHeight - 4 + "px";
      });
    }

    this.feedMain.onscroll = this.checksNewPosts.bind(this);

    const publishButton = document.getElementById("publish-post-button");
    const fileInput = document.getElementById("news__file-input");
    const fileButton = document.getElementById("news__file-button");
    const dt = new DataTransfer();

    fileButton?.addEventListener("click", () => {
      fileInput.click();
    });

    if (fileInput) {
      fileInput.addEventListener("change", () => {
        const files = fileInput.files;

        Array.from(files).forEach((file) => {
          dt.items.add(file);
        });

        fileInput.value = "";

        const imgContent = document.getElementById("news-img-content");
        const fileContent = document.getElementById("news-file-content");

        imgContent.innerHTML = "";
        fileContent.innerHTML = "";

        Array.from(dt.files).forEach((elem) => {
          const src = URL.createObjectURL(elem);
          const fileName = elem.name;
          const isImage = imageTypes.includes(typeFile(elem));

          const cancelImg = buildComponent(
            "img",
            { src: "dist/images/cancel.png", "data-id": fileName },
            [`news-${isImage ? "img" : "file"}-content__cancel-img`],
          );

          cancelImg.addEventListener("click", () => {
            document
              .getElementById(
                `news-${isImage ? "img" : "file"}-content-block-${fileName}`,
              )
              ?.remove();

            Array.from(dt.files).forEach((file, index) => {
              if (file.name === fileName) {
                dt.items.remove(index);
                return;
              }
            });
          });

          if (isImage) {
            const imgBlock = buildComponent(
              "div",
              { id: `news-img-content-block-${fileName}` },
              ["news-img-content-block"],
            );
            appendChildren(imgContent, [
              appendChildren(imgBlock, [
                buildComponent(
                  "img",
                  { src: src, "data-id": `news-file-content-${fileName}` },
                  ["news-img-content__img", "post-content__img"],
                ),
                cancelImg,
              ]),
            ]);
          } else {
            const fileBlock = buildComponent(
              "div",
              { id: `news-file-content-block-${fileName}` },
              ["news-file-content-block"],
            );
            appendChildren(fileContent, [
              appendChildren(fileBlock, [
                appendChildren(
                  buildComponent(
                    "a",
                    {
                      target: "_blank",
                      rel: "noopener",
                      href: src,
                      download: fileName,
                    },
                    ["news-file-content__a"],
                  ),
                  [
                    buildComponent(
                      "span",
                      {},
                      ["news-file-content__name-span"],
                      fileName,
                    ),
                    buildComponent(
                      "img",
                      {
                        src: "dist/images/document.png",
                        id: `news-file-content-${fileName}`,
                      },
                      ["news-file-content__img"],
                    ),
                  ],
                ),
                cancelImg,
              ]),
            ]);
          }
        });
      });
    }

    publishButton?.addEventListener("click", () => {
      const content = document.getElementById("news-content__textarea").value;

      if (content.trim() === "" && dt.files.length === 0) {
        return;
      }

      this.eventBus.emit("clickedPublishPost", {
        content: content,
        attachments: dt.files,
      });

      dt.items.clear();
      document.getElementById("news-img-content").innerHTML = "";
      document.getElementById("news-file-content").innerHTML = "";
      const textarea = document.getElementById("news-content__textarea");
      textarea.value = "";
      textarea.style.height = "60px";
      fileInput.value = null;
    });

    this.subscribeUser = document.getElementById(`subscribe-${this.userId}`);
    this.sendMessageUser = document.getElementById(
      `send-message-${this.userId}`,
    );
    this.favoritesChat = document.getElementById("favorites-chat");

    this.subscribeUser?.addEventListener("click", () => {
      if (
        this.subscribeUser.classList.contains(
          "subscribed-to-options__button-subscribe",
        )
      ) {
        this.eventBus.emit("clickedSubscribe", this.userId);
      } else {
        customConfirm(
          (() => {
            this.eventBus.emit("clickedUnsubscribe", this.userId);
          }).bind(this),
          "Удалить друга?",
          "Вы уверены, что хотите удалить друга?",
          "Удалить",
          "Отмена",
        );
      }
    });

    this.sendMessageUser?.addEventListener("click", () => {
      this.router.redirect(`/chat/${this.userId}`);
    });

    this.favoritesChat?.addEventListener("click", () => {
      this.router.redirect(`/chat/${this.userId}`);
    });

    this.eventBus.emit("readyRenderPosts", {
      userId: this.userId,
      lastPostId: this.lastPostId,
    });
  }

  /**
   * Updates button of profile post if subscribed
   * @return {void}
   */
  updateSubscribed() {
    this.subscribeUser.classList.remove(
      "subscribed-to-options__button-subscribe",
    );
    this.subscribeUser.classList.add(
      "subscribed-to-options__button-unsubscribe",
    );
    if (this.isSubscriber) {
      this.subscribeUser.innerHTML = "Удалить из друзей";
    } else {
      this.subscribeUser.innerHTML = "Отписаться";
    }
    this.sendMessageUser.classList.remove(
      "subscribed-to-options__button-subscribe-message",
    );
    this.sendMessageUser.classList.add(
      "subscribed-to-options__button-unsubscribe-message",
    );
  }

  /**
   * Updates button of profile post if unsubscribed
   * @return {void}
   */
  updateUnsubscribed() {
    this.subscribeUser.classList.remove(
      "subscribed-to-options__button-unsubscribe",
    );
    this.subscribeUser.classList.add("subscribed-to-options__button-subscribe");
    if (this.isSubscriber) {
      this.subscribeUser.innerHTML = "Принять заявку в друзья";
    } else {
      this.subscribeUser.innerHTML = "Подписаться";
    }
    this.sendMessageUser.classList.remove(
      "subscribed-to-options__button-unsubscribe-message",
    );
    this.sendMessageUser.classList.add(
      "subscribed-to-options__button-subscribe-message",
    );
  }

  /**
   * Updates button of profile post if subscribed
   * @param {PostInfo} postInfo - The info about user's posts
   * @return {void}
   */
  renderPosts({ author, posts }) {
    this.isWaitPosts = false;

    document.getElementById("posts-sceleton")?.remove();

    if (posts.length > 0) {
      posts.forEach((elem) => {
        if (elem.postId < this.lastPostId || this.lastPostId === 0) {
          this.lastPostId = elem.postId;
        }
      });
      posts.forEach((elem) => {
        this.postController.renderFriendPostView({
          post: elem,
          author: author,
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
   * @param {PostInfo} postInfo - The info about user's posts
   * @return {void}
   */
  postPublishedSuccess({ post, author }) {
    this.postController.renderFriendPostView({
      post: post,
      author: author,
      publish: true,
    });
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

export default ProfileView;
