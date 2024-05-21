import BaseView from "../../MVC/BaseView.js";
import { formatFullDate } from "../../modules/dateRemaking.js";
import UserState from "../UserState.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import "./post.scss";
import { makePost } from "../../modules/makeComponents.js";
import CommentController from "../Comment/CommentController.js";

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

/**
 * PostView - класс для работы с визуалом на странице.
 */
class PostView extends BaseView {
  /**
   * Конструктор класса PostView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus, router) {
    super(eventBus);
    this.router = router;
    this.commentsController = new CommentController(router);

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
    this.eventBus.addEventListener(
      "postLoadedSuccess",
      this.defineWhatPost.bind(this),
    );
    this.eventBus.addEventListener(
      "needRenderPostMain",
      this.renderPostMain.bind(this),
    );
    this.eventBus.addEventListener(
      "postCommentAdded",
      this.commentsController.addComment.bind(this.commentsController),
    );
  }

  /**
   * Renders the page with current post
   *
   * @param {number} postId - The ID of post
   */
  renderPostMain(postId) {
    const template = require("./postMain.hbs");
    const { userId, avatar, firstName, lastName } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    const postMainElement = document.getElementById("post-main");
    this.mainElement = postMainElement;
    this.isPostPage = true;

    this.mainElement.innerHTML = template({});
    const activityElement = document.getElementById("activity");
    activityElement.classList.add("activity_invisible");

    this.postId = postId;

    document.getElementById("go-to-feed__img").addEventListener("click", () => {
      postMainElement.classList.add("post-main_invisible");
      activityElement.classList.remove("activity_invisible");
      document.getElementById(`post-${postId}`)?.scrollIntoView();
    });

    document
      .getElementById("go-to-feed__span")
      .addEventListener("click", () => {
        postMainElement.classList.add("post-main_invisible");
        activityElement.classList.remove("activity_invisible");
        document.getElementById(`post-${postId}`)?.scrollIntoView();
      });

    this.eventBus.emit("readyRenderPost", { postId: this.postId });
    this.commentsController.renderComments(this.postId);
  }

  /**
   * Defines which post: group's or friend's
   *
   * @param {PostInfo} result - The received post
   */
  defineWhatPost(result) {
    if (!result.group) {
      this.renderFriendPost(result);
    } else {
      this.renderGroupPost(result);
    }
  }

  /**
   * Renders a friend post
   *
   * @param {PostInfo} postInfo - The info about current post
   */
  renderFriendPost({ post, author, publish }) {
    let { userId, avatar } = UserState;
    avatar = avatar || "default_avatar.png";
    author.avatar = author.avatar || "default_avatar.png";

    let isMe = Number(author.userId) === Number(userId);
    const isPostPage = this.isPostPage;
    const hasUpdated = post.createdAt !== post.updatedAt;

    post.createdAt = formatFullDate(post.createdAt);
    post.updatedAt = `обновлено ${formatFullDate(post.updatedAt)}`;

    if (post.likedBy) {
      post.likesCount = post.likedBy.length;
      post.isLikedByMe = post.likedBy.includes(UserState.userId);
    } else {
      post.likesCount = 0;
    }

    const newPost = makePost(
      null,
      post,
      author,
      avatar,
      isMe,
      hasUpdated,
      isPostPage,
      this.eventBus,
    );

    let currentMainElement = isPostPage
      ? document.getElementById("single-post")
      : document.getElementById("posts");
    if (publish) {
      currentMainElement.insertBefore(
        newPost,
        currentMainElement.firstElementChild,
      );
    } else {
      currentMainElement.appendChild(newPost);
    }

    if (isPostPage) {
      document
        .getElementById("post-main")
        .classList.remove("post-main_invisible");
    }

    const postContent = newPost.firstElementChild.nextElementSibling;
    const postTextarea = postContent.firstElementChild;

    postTextarea.toggleAttribute("readonly");

    const postTextareaScrollHeight = postTextarea.scrollHeight;
    if (postTextareaScrollHeight > 300) {
      postTextarea.style.height = "300px";

      const showMore = document.createElement("button");
      showMore.classList.add("post-content__show-more-button");
      showMore.setAttribute("data-id", post.postId);
      showMore.innerHTML = "Показать ещё";

      postContent.appendChild(showMore);

      showMore.addEventListener("click", () => {
        postTextarea.style.height = postTextarea.scrollHeight + "px";
        showMore.remove();
      });
    } else {
      if (postTextarea.innerHTML.trim() !== "") {
        postTextarea.style.height = postTextarea.scrollHeight + "px";
      } else {
        postTextarea.style.height = 0;
      }
    }
    this.isPostPage = false;
  }

  /**
   * Renders a group post
   *
   * @param {*} param0
   */
  renderGroupPost({ post, publish, group }) {
    let { userId, avatar } = UserState;
    avatar = avatar || "default_avatar.png";
    group.avatar = group.avatar || "default_avatar.png";

    let isMe = Number(post.authorId) === Number(userId);
    const isPostPage = this.isPostPage;
    const hasUpdated = post.createdAt !== post.updatedAt;

    post.createdAt = formatFullDate(post.createdAt);
    post.updatedAt = `обновлено ${formatFullDate(post.updatedAt)}`;

    if (post.likedBy) {
      post.likesCount = post.likedBy.length;
      post.isLikedByMe = post.likedBy.includes(UserState.userId);
    } else {
      post.likesCount = 0;
    }

    const newPost = makePost(
      group,
      post,
      null,
      avatar,
      isMe,
      hasUpdated,
      isPostPage,
      this.eventBus,
    );

    let currentMainElement = isPostPage
      ? document.getElementById("single-post")
      : document.getElementById("posts");
    if (publish) {
      currentMainElement.insertBefore(
        newPost,
        currentMainElement.firstElementChild,
      );
    } else {
      currentMainElement.appendChild(newPost);
    }

    if (isPostPage) {
      document
        .getElementById("post-main")
        .classList.remove("post-main_invisible");
    }

    const postContent = newPost.firstElementChild.nextElementSibling;
    const postTextarea = postContent.firstElementChild;

    postTextarea.toggleAttribute("readonly");

    const postTextareaScrollHeight = postTextarea.scrollHeight;
    if (postTextareaScrollHeight > 300) {
      postTextarea.style.height = "300px";

      const showMore = document.createElement("button");
      showMore.classList.add("post-content__show-more-button");
      showMore.setAttribute("data-id", post.postId);
      showMore.innerHTML = "Показать ещё";

      postContent.appendChild(showMore);

      showMore.addEventListener("click", () => {
        postTextarea.style.height = postTextarea.scrollHeight + "px";
        showMore.remove();
      });
    } else {
      if (postTextarea.innerHTML.trim() !== "") {
        postTextarea.style.height = postTextarea.scrollHeight + "px";
      } else {
        postTextarea.style.height = 0;
      }
    }
    this.isPostPage = false;
  }

  /**
   * Set post liked
   *
   * @param {number} postId - The ID of current post
   */
  likedPost(postId) {
    let likedPostParent = document.querySelector(
      `#single-post-${postId} .reactions__heart-img_unliked`,
    )?.parentElement;
    let likesCount = document.querySelector(
      `#single-post-${postId} .likes-count__span`,
    );
    if (!likedPostParent) {
      likedPostParent = document.querySelector(
        `#post-${postId} .reactions__heart-img_unliked`,
      ).parentElement;
      likesCount = document.querySelector(`#post-${postId} .likes-count__span`);
    }

    const likedPost = document.createElement("img");
    likedPost.setAttribute("src", "dist/images/filled-heart.png");
    likedPost.dataset.id = postId;
    likedPost.classList.add("reactions__heart-img_liked");
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
    let unlikedPostParent = document.querySelector(
      `#single-post-${postId} .reactions__heart-img_liked`,
    )?.parentElement;
    let likesCount = document.querySelector(
      `#single-post-${postId} .likes-count__span`,
    );
    if (!unlikedPostParent) {
      unlikedPostParent = document.querySelector(
        `#post-${postId} .reactions__heart-img_liked`,
      ).parentElement;
      likesCount = document.querySelector(`#post-${postId} .likes-count__span`);
    }
    const unlikedPost = document.createElement("img");
    unlikedPost.dataset.id = postId;
    unlikedPost.setAttribute("src", "dist/images/heart.png");
    unlikedPost.classList.add("reactions__heart-img_unliked");
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
  updatePost({ post: { postId, updatedAt } }) {
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
  canceledUpdatePost({ post }) {
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
    document.getElementById(`post-${postId}`)?.remove();
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
