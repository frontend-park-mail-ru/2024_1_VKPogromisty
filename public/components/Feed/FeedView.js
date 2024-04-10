import BaseView from "../../MVC/BaseView.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "../../modules/consts.js";
import { formatFullDate } from "../../modules/dateRemaking.js";

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
 * @property {Post} post - The current post
 * @property {Author} author - The author of post
 */

const staticUrl = `${API_URL}/static`;

const rightSidebar = [
  {
    href: "/nothing",
    text: "НОВОСТИ",
  },
  {
    href: "/nothing",
    text: "СООБЩЕСТВА",
  },
  {
    href: "/nothing",
    text: "ДРУЗЬЯ",
  },
  {
    href: "/nothing",
    text: "ФОТОГРАФИИ",
  },
];

/**
 * FeedView - класс для работы с визуалом на странице.
 */
class FeedView extends BaseView {
  /**
   * Конструктор класса FeedView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   * @param {UserState} userState - Текущее состояние юзера
   */
  constructor(eventBus, router, userState) {
    super(eventBus);

    this.router = router;
    this.userState = userState;

    this.eventBus.addEventListener(
      "getPostsSuccess",
      this.renderPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "publishedPostSuccess",
      this.renderPublishedSuccess.bind(this),
    );
    this.eventBus.addEventListener(
      "postDeleteSuccess",
      this.postDeletedSuccess.bind(this),
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
   * Checks if user scrolled enough
   */
  checksNewPosts() {
    if (
      document.body.scrollHeight - window.scrollY <= 1500 &&
      !this.isAllPosts &&
      !this.isWaitPosts
    ) {
      this.eventBus.emit("readyRenderPosts", this.lastPostId);
      this.isWaitPosts = true;
    }
  }

  /**
   * Renders main part of feed
   */
  renderFeedMain() {
    const { userId, avatar, firstName, lastName } = this.userState;
    const template = Handlebars.templates["feedMain.hbs"];
    const userAvatar = `${staticUrl}/${avatar}`;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    this.mainElement = document.getElementById("activity");
    this.mainElement.innerHTML = template({ userId, userAvatar, rightSidebar });
    this.lastPostId = 0;
    this.isAllPosts = false;

    document.getElementById("logout-button").addEventListener("click", () => {
      document.removeEventListener("scroll", this.checksNewPosts.bind(this));
      this.eventBus.emit("clickLogoutButton", {});
    });

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

    this.postsElement = document.getElementById("posts");
    this.eventBus.emit("readyRenderPosts", this.lastPostId);
  }

  /**
   * Renders post on feed
   *
   * @param {PostInfo[]} posts - The posts to feed
   */
  renderPosts(posts) {
    this.isWaitPosts = false;
    const template = Handlebars.templates["feedPost.hbs"];
    const avatar = this.userState.avatar;

    if (posts) {
      posts.forEach((elem) => {
        if (elem.post.createdAt !== elem.post.updatedAt) {
          elem.post.hasUpdated = true;
        }
        if (elem.post.postId < this.lastPostId || this.lastPostId === 0) {
          this.lastPostId = elem.post.postId;
        }
      });
      posts.forEach((elem) => {
        elem.post.createdAt = formatFullDate(elem.post.createdAt);
      });
      posts.forEach((elem) => {
        elem.post.updatedAt = `обновлено ${formatFullDate(elem.post.updatedAt)}`;
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
    });

    document.querySelectorAll(".post-content__text-span").forEach((elem) => {
      console.log("asdf");
      const scrHeight = elem.scrollHeight;
      if (scrHeight > 2000) {
        elem.style.height = "1000px";
      } else {
        elem.style.height = scrHeight - 4 + "px";
      }
    });
  }

  /**
   * The post to be published
   *
   * @param {PostInfo} post
   */
  renderPublishedSuccess(post) {
    document.getElementById("news-img-content").innerHTML = "";
    const textarea = document.getElementById("news-content__textarea");
    textarea.value = "";
    textarea.style.height = "60px";

    const template = Handlebars.templates["feedPost.hbs"];
    const avatar = this.userState.avatar;
    post.post.createdAt = formatFullDate(post.post.createdAt);

    const posts = [post];
    const isMe = true;
    const postId = post.postId;

    this.postsElement.innerHTML =
      template({
        posts,
        avatar,
        staticUrl,
        isMe,
      }) + this.postsElement.innerHTML;

    const curTextarea = document.getElementById(`textarea-${postId}`);
    const scrHeight = curTextarea.scrollHeight;
    if (scrHeight > 2000) {
      curTextarea.style.height = "1000px";
    } else {
      curTextarea.style.height = scrHeight - 4 + "px";
    }

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

export default FeedView;
