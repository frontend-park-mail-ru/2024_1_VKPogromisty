import {
  formatDayMonthYear,
  formatFullDate,
} from "../../modules/dateRemaking.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import BaseView from "/public/MVC/BaseView.js";
import { API_URL } from "/public/modules/consts.js";

const staticUrl = `${API_URL}/static`;

/**
 * A Author structure
 * @typedef {Object} Author
 * @property {string} avatar - The avatar of user
 * @property {string} createdAt - The date of creating accout
 * @property {string} detaOfBirth - The date of birth current user
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
  constructor(eventBus, router, userState) {
    super(eventBus);

    this.router = router;
    this.userState = userState;

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
      "postDeleteSuccess",
      this.postDeletedSuccess.bind(this),
    );
    this.eventBus.addEventListener(
      "publishedPostSuccess",
      this.postPublishedSuccess.bind(this),
    );
    this.eventBus.addEventListener(
      "postUpdateSuccess",
      this.postUpdatedSuccess.bind(this),
    );
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  /**
   * Renders header and sidebar of page
   * @param {UserInfo} userInfo - The info about session's user
   */
  renderProfileMain(user_id) {
    this.userId = user_id;
    const { userId, avatar, firstName, lastName } = this.userState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    document.getElementById("logout-button").addEventListener("click", () => {
      document.removeEventListener("scroll", this.checksNewPosts.bind(this));
      this.eventBus.emit("clickLogoutButton", {});
    });

    this.eventBus.emit("readyRenderProfile", this.userId);
  }

  /**
   * Checks if user scrolled enough
   */
  checksNewPosts() {
    if (
      document.body.scrollHeight - window.scrollY <= 1500 &&
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

    const { userId, firstName, lastName, dateOfBirth, avatar } = User;
    this.mainElement = document.getElementById("activity");
    this.isSubscriber = isSubscriber;
    const isMe = (this.isMe =
      Number(this.userId) === Number(this.userState.userId));

    const template = Handlebars.templates["profileMain.hbs"];
    this.mainElement.innerHTML = template({
      avatar,
      firstName,
      lastName,
      dateOfBirth,
      userId,
      staticUrl,
      isMe,
      isSubscribedTo,
      isSubscriber,
    });

    this.postsElement = document.getElementById("posts");
    this.lastPostId = 0;
    this.isAllPosts = false;

    const newsTextarea = document.getElementById("news-content__textarea");

    if (newsTextarea) {
      newsTextarea.addEventListener("input", () => {
        newsTextarea.style.height = "auto";
        newsTextarea.style.height = newsTextarea.scrollHeight - 4 + "px";
      });
    }

    document.addEventListener("scroll", this.checksNewPosts.bind(this));

    const publishButton = document.getElementById("publish-post-button");
    const fileInput = document.getElementById("news__file-input");
    const fileButton = document.getElementById("news__file-button");

    if (fileButton) {
      fileButton.addEventListener("click", () => {
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", () => {
        const files = fileInput.files;
        const imgContent = document.getElementById("news-img-content");

        imgContent.innerHTML = "";

        Array.from(files).forEach((elem) => {
          const src = URL.createObjectURL(elem);

          const img = document.createElement("img");
          img.setAttribute("src", src);
          img.classList.add("news-img-content__img");

          imgContent.appendChild(img);
        });
      });
    }

    if (publishButton !== null) {
      publishButton.addEventListener("click", () => {
        const content = document.getElementById("news-content__textarea").value;

        if (content === "" && fileInput.files.length === 0) {
          return;
        }
        this.eventBus.emit("clickedPublishPost", {
          content: content,
          attachments: fileInput.files,
        });
      });
    }

    this.subscribeUser = document.getElementById(`subscribe-${this.userId}`);
    this.sendMessageUser = document.getElementById(
      `send-message-${this.userId}`,
    );

    if (this.subscribeUser !== null) {
      this.subscribeUser.addEventListener("click", () => {
        if (
          this.subscribeUser.classList.contains(
            "subscribed-to-options__button-subscribe",
          )
        ) {
          this.eventBus.emit("clickedSubscribe", this.userId);
        } else {
          this.eventBus.emit("clickedUnsubscribe", this.userId);
        }
      });
    }

    if (this.sendMessageUser !== null) {
      this.sendMessageUser.addEventListener("click", () => {
        this.router.redirect(`/chat/${this.userId}`);
      });
    }

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
    const template = Handlebars.templates["profilePost.hbs"];
    const avatar = this.userState.avatar;

    const isMe = this.isMe;

    if (posts) {
      posts.forEach((elem) => {
        if (elem.createdAt !== elem.updatedAt) {
          elem.hasUpdated = true;
        }
        if (elem.postId < this.lastPostId || this.lastPostId === 0) {
          this.lastPostId = elem.postId;
        }
      });
      posts.forEach((elem) => {
        elem.createdAt = formatFullDate(elem.createdAt);
      });
      posts.forEach((elem) => {
        elem.updatedAt = `обновлено ${formatFullDate(elem.updatedAt)}`;
      });
    } else {
      this.isAllPosts = true;
      document
        .getElementById("no-more-posts")
        .classList.replace("no-more-posts__hidden", "no-more-posts__visible");
    }

    this.postsElement.innerHTML += template({
      posts,
      avatar,
      staticUrl,
      author,
      isMe,
    });

    const trashes = document.querySelectorAll(".post-author__trash-basket-img");
    const edits = document.querySelectorAll(".post-author__edit-img");

    trashes.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.eventBus.emit("clickedDeletePost", elem.dataset.id);
      });
    });

    edits.forEach((elem) => {
      elem.addEventListener("click", () => {
        const parent = elem.parentNode;
        const nextElem = elem.nextElementSibling;
        const id = elem.dataset.id;
        const textarea = document.getElementById(`textarea-${id}`);

        textarea.removeAttribute("readonly");
        textarea.focus();

        const ok = document.createElement("img");
        ok.classList.add("post-author__accept-img");
        ok.setAttribute("data-id", id);
        ok.setAttribute("src", "../static/images/check.png");
        ok.addEventListener("click", () => {
          if (textarea.value === "") {
            return;
          }

          this.eventBus.emit("clickedUpdatePost", {
            content: textarea.value,
            attachments: null,
            post_id: id,
          });
        });

        const cancel = document.createElement("img");
        cancel.classList.add("post-author__cancel-img");
        cancel.setAttribute("data-id", id);
        cancel.setAttribute("src", "../static/images/cancel.png");
        cancel.addEventListener("click", () => {
          textarea.toggleAttribute("readonly");
          elem.style["display"] = "block";
          nextElem.style["display"] = "block";
          cancel.remove();
          ok.remove();
        });

        parent.appendChild(ok);
        parent.appendChild(cancel);
        elem.style["display"] = "none";
        nextElem.style["display"] = "none";
      });
    });
  }

  /**
   * Pusblishes the new post on page
   * @param {PostInfo} postInfo - The info about user's posts
   * @return {void}
   */
  postPublishedSuccess({ post, author }) {
    document.getElementById("news-img-content").innerHTML = "";
    document.getElementById("news-content__textarea").value = "";

    const template = Handlebars.templates["profilePost.hbs"];
    const avatar = this.userState.avatar;

    post.createdAt = formatFullDate(post.createdAt);

    const isMe = this.isMe;
    const posts = [post];

    this.postsElement.innerHTML =
      template({
        posts,
        avatar,
        staticUrl,
        author,
        isMe,
      }) + this.postsElement.innerHTML;

    const trashes = document.querySelectorAll(".post-author__trash-basket-img");
    const edits = document.querySelectorAll(".post-author__edit-img");

    trashes.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.eventBus.emit("clickedDeletePost", elem.dataset.id);
      });
    });

    edits.forEach((elem) => {
      elem.addEventListener("click", () => {
        const parent = elem.parentNode;
        const nextElem = elem.nextElementSibling;
        const id = elem.dataset.id;
        const textarea = document.getElementById(`textarea-${id}`);

        textarea.removeAttribute("readonly");
        textarea.focus();

        const ok = document.createElement("img");
        ok.classList.add("post-author__accept-img");
        ok.setAttribute("data-id", id);
        ok.setAttribute("src", "../static/images/check.png");
        ok.addEventListener("click", () => {
          if (textarea.value === "") {
            return;
          }

          this.eventBus.emit("clickedUpdatePost", {
            content: textarea.value,
            attachments: null,
            post_id: id,
          });
        });

        const cancel = document.createElement("img");
        cancel.classList.add("post-author__cancel-img");
        cancel.setAttribute("data-id", id);
        cancel.setAttribute("src", "../static/images/cancel.png");
        cancel.addEventListener("click", () => {
          textarea.toggleAttribute("readonly");
          elem.style["display"] = "block";
          nextElem.style["display"] = "block";
          cancel.remove();
          ok.remove();
        });

        parent.appendChild(ok);
        parent.appendChild(cancel);
        elem.style["display"] = "none";
        nextElem.style["display"] = "none";
      });
    });
  }

  /**
   * Updates the current post on page
   * @param {Post} postInfo - The info about updated post
   * @return {void}
   */
  postUpdatedSuccess({ postId, updatedAt }) {
    const postMenu = document.getElementById(`post-menu-${postId}`);
    const textarea = document.getElementById(`textarea-${postId}`);
    const edited = document.getElementById(`edited-${postId}`);

    if (edited) {
      edited.innerHTML = `обновлено ${formatFullDate(updatedAt)}`;
    } else {
      const postAuthorTime = document.getElementById(
        `post-author-time-${postId}`,
      );

      const img = document.createElement("img");
      img.setAttribute("src", "../static/images/dot.png");
      img.classList.add("post-author-time__dot-img");

      const span = document.createElement("span");
      span.setAttribute("id", `edited-${postId}`);
      span.classList.add("post-author-time__last-time-span");
      span.innerHTML = `обновлено ${formatFullDate(updatedAt)}`;

      postAuthorTime.appendChild(img);
      postAuthorTime.appendChild(span);
    }

    textarea.toggleAttribute("readonly");
    postMenu.lastChild.remove();
    postMenu.lastChild.remove();
    postMenu.firstElementChild.style["display"] = "block";
    postMenu.firstElementChild.nextElementSibling.style["display"] = "block";
  }

  /**
   * Deletes post from the page
   * @param {number} postId - The ID of post deleted
   * @return {void}
   */
  postDeletedSuccess(postId) {
    const post = document.getElementById(`post${postId}`);

    if (post !== null) {
      post.remove();
    }
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
