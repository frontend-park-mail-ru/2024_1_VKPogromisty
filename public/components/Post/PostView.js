import BaseView from "../../MVC/BaseView.js";
import { formatFullDate } from "../../modules/dateRemaking.js";
import { API_URL } from "/public/modules/consts.js";
import UserState from "../UserState.js";
import "./post.scss";
import { customConfirm } from "../../modules/windows.js";

/**
 * @typedef {Object} UpdateInfo
 * @property {number} postId - The ID of current post
 * @property {string} updatedAt - The data of last update
 */

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
 * @typedef {Object} PostInfo
 * @property {Post} post - The current post
 * @property {Author} author - The author of current post
 * @property {boolean} publish - Is published now?
 */

const staticUrl = `${API_URL}/static`;

/**
 * PostView - класс для работы с визуалом на странице.
 */
class PostView extends BaseView {
  /**
   * Конструктор класса PostView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus) {
    super(eventBus);

    this.eventBus.addEventListener(
      "postDeleteSuccess",
      this.deletePost.bind(this),
    );
    this.eventBus.addEventListener(
      "postUpdateSuccess",
      this.updatePost.bind(this),
    );
    this.eventBus.addEventListener(
      "postCanceledSuccess",
      this.canceledUpdatePost.bind(this),
    );
    this.eventBus.addEventListener(
      "postLikedSuccess",
      this.likedPost.bind(this),
    );
    this.eventBus.addEventListener(
      "postUnlikedSuccess",
      this.unlikedPost.bind(this),
    );
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  /**
   * Renders current post on page
   *
   * @param {PostInfo} postInfo - The info about current post
   */
  renderPost({ isGroup, post, author, publish, canDelete }) {
    const { userId, avatar } = UserState;

    const template = require("./post.hbs");
    const postId = post.postId;

    let isMe = Number(author.userId) === Number(userId);
    const hasUpdated = post.createdAt !== post.updatedAt;

    post.createdAt = formatFullDate(post.createdAt);
    post.updatedAt = `обновлено ${formatFullDate(post.updatedAt)}`;

    this.mainElement = document.getElementById("posts");

    if (post.likedBy) {
      post.likesCount = post.likedBy.length;
      post.isLikedByMe = post.likedBy.includes(UserState.userId);
    } else {
      post.likesCount = 0;
    }

    if (isGroup) {
      isMe = canDelete;
    }

    if (publish) {
      this.mainElement.innerHTML =
        template({
          post,
          author,
          avatar,
          staticUrl,
          isMe,
          hasUpdated,
          isGroup,
        }) + this.mainElement.innerHTML;
    } else {
      this.mainElement.innerHTML += template({
        post,
        author,
        avatar,
        staticUrl,
        isMe,
        hasUpdated,
        isGroup,
      });
    }

    const textarea = document.getElementById(`textarea-${postId}`);
    textarea.style.height = textarea.scrollHeight + "px";

    const content = document.getElementById(`post-content-${postId}`);
    const contentScrHeight = content.scrollHeight;
    if (contentScrHeight > 1000) {
      content.style.height = "1000px";

      const showMore = document.createElement("button");
      showMore.classList.add("post-content__show-more-button");
      showMore.setAttribute("data-id", postId);
      showMore.innerHTML = "Показать ещё";

      content.appendChild(showMore);
    }

    document
      .querySelectorAll(".reactions__heart-img_unliked")
      .forEach((elem) => {
        elem.addEventListener("mouseenter", () => {
          elem.setAttribute("src", "dist/images/filled-heart.png");
          elem.style.width = "28px";
          elem.style.height = "28px";
        });
        elem.addEventListener("mouseleave", () => {
          elem.setAttribute("src", "dist/images/heart.png");
          elem.style.width = "25px";
          elem.style.height = "25px";
        });
        elem.addEventListener("click", () => {
          this.eventBus.emit("clickedLikePost", +elem.dataset.id);
        });
      });

    document.querySelectorAll(".reactions__heart-img_liked").forEach((elem) => {
      elem.addEventListener("mouseenter", () => {
        elem.setAttribute("src", "dist/images/broken-heart.png");
        elem.style.width = "28px";
        elem.style.height = "28px";
      });
      elem.addEventListener("mouseleave", () => {
        elem.setAttribute("src", "dist/images/filled-heart.png");
        elem.style.width = "25px";
        elem.style.height = "25px";
      });
      elem.addEventListener("click", () => {
        this.eventBus.emit("clickedUnlikePost", +elem.dataset.id);
      });
    });

    document.querySelectorAll(".post-author__edit-img").forEach((elem) => {
      elem.addEventListener("click", () => {
        const parent = elem.parentNode;
        const nextElem = elem.nextElementSibling;
        const id = elem.dataset.id;
        const textarea = document.getElementById(`textarea-${id}`);

        textarea.removeAttribute("readonly");
        textarea.addEventListener("input", () => {
          textarea.style.height = "auto";
        });
        textarea.focus();

        const ok = document.createElement("img");
        ok.classList.add("post-author__accept-img");
        ok.setAttribute("data-id", id);
        ok.setAttribute("src", "dist/images/check.png");
        ok.addEventListener("click", () => {
          if (textarea.value.trim() === "") {
            return;
          }

          this.eventBus.emit("clickedUpdatePost", {
            content: textarea.value,
            attachments: null,
            postId: id,
          });
        });

        const cancel = document.createElement("img");
        cancel.classList.add("post-author__cancel-img");
        cancel.setAttribute("data-id", id);
        cancel.setAttribute("src", "dist/images/cancel.png");
        cancel.addEventListener("click", () => {
          this.eventBus.emit("canceledUpdatePost", id);
        });

        parent.appendChild(ok);
        parent.appendChild(cancel);
        elem.style["display"] = "none";
        nextElem.style["display"] = "none";
      });
    });

    document
      .querySelectorAll(".post-author__trash-basket-img")
      .forEach((elem) => {
        elem.addEventListener("click", () => {
          customConfirm(
            (() => {
              this.eventBus.emit("clickedDeleteButton", elem.dataset.id);
            }).bind(this),
            "Удалить пост?",
            "Вы уверены, что хотите удалить пост?",
            "Удалить",
            "Отмена",
          );
        });
      });

    document
      .querySelectorAll(".post-content__show-more-button")
      .forEach((elem) => {
        elem.addEventListener("click", () => {
          const postContent = document.getElementById(
            `post-content-${elem.dataset.id}`,
          );
          postContent.style.height = postContent.scrollHeight - 4 + "px";
          elem.remove();
        });
      });
  }

  /**
   * Set post liked
   *
   * @param {number} postId - The ID of current post
   */
  likedPost(postId) {
    const likedPostParent = document.querySelector(
      `#post-${postId} .reactions__heart-img_unliked`,
    ).parentElement;
    const likedPost = document.createElement("img");
    likedPost.setAttribute("src", "dist/images/filled-heart.png");
    likedPost.dataset.id = postId;
    likedPost.classList.add("reactions__heart-img_liked");
    const likesCount = document.querySelector(
      `#post-${postId} .likes-count__span`,
    );
    likesCount.innerHTML = +likesCount.innerHTML + 1;
    likedPostParent.replaceChild(likedPost, likedPostParent.firstElementChild);

    likedPost.addEventListener("mouseenter", () => {
      likedPost.setAttribute("src", "dist/images/broken-heart.png");
      likedPost.style.width = "28px";
      likedPost.style.height = "28px";
    });
    likedPost.addEventListener("mouseleave", () => {
      likedPost.setAttribute("src", "dist/images/filled-heart.png");
      likedPost.style.width = "25px";
      likedPost.style.height = "25px";
    });
    likedPost.addEventListener("click", () => {
      this.eventBus.emit("clickedUnlikePost", likedPost.dataset.id);
    });
  }

  /**
   * Set post unliked
   *
   * @param {number} postId - The ID of current post
   */
  unlikedPost(postId) {
    const unlikedPostParent = document.querySelector(
      `#post-${postId} .reactions__heart-img_liked`,
    ).parentElement;
    const unlikedPost = document.createElement("img");
    unlikedPost.dataset.id = postId;
    unlikedPost.setAttribute("src", "dist/images/heart.png");
    unlikedPost.classList.add("reactions__heart-img_unliked");
    const likesCount = document.querySelector(
      `#post-${postId} .likes-count__span`,
    );
    likesCount.innerHTML = +likesCount.innerHTML - 1;
    unlikedPostParent.replaceChild(
      unlikedPost,
      unlikedPostParent.firstElementChild,
    );

    unlikedPost.addEventListener("mouseenter", () => {
      unlikedPost.setAttribute("src", "dist/images/filled-heart.png");
      unlikedPost.style.width = "28px";
      unlikedPost.style.height = "28px";
    });
    unlikedPost.addEventListener("mouseleave", () => {
      unlikedPost.setAttribute("src", "dist/images/heart.png");
      unlikedPost.style.width = "25px";
      unlikedPost.style.height = "25px";
    });
    unlikedPost.addEventListener("click", () => {
      this.eventBus.emit("clickedLikePost", unlikedPost.dataset.id);
    });
  }

  /**
   * Updates current post on page
   *
   * @param {UpdateInfo} udpateInfo - The info about updated post
   */
  updatePost({ postId, updatedAt }) {
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
      img.setAttribute("src", "dist/images/dot.png");
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
    postMenu.firstElementChild.style.display = "block";
    postMenu.firstElementChild.nextElementSibling.style.display = "block";
  }

  /**
   * Rollbacks changes in post
   *
   * @param {Post} post - The current post
   */
  canceledUpdatePost(post) {
    const postMenu = document.getElementById(`post-menu-${post.postId}`);
    const textarea = document.getElementById(`textarea-${post.postId}`);

    textarea.toggleAttribute("readonly");
    textarea.value = post.content;
    postMenu.lastChild.remove();
    postMenu.lastChild.remove();
    postMenu.firstElementChild.style.display = "block";
    postMenu.firstElementChild.nextElementSibling.style.display = "block";
  }

  /**
   * Deletes current post from page
   *
   * @param {number} postId - The ID of current post
   */
  deletePost(postId) {
    const post = document.getElementById(`post-${postId}`);

    post?.remove();
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

export default PostView;
