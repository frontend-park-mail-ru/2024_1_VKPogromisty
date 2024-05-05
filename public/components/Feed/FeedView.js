import BaseView from "../../MVC/BaseView.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "../../modules/consts.js";
import PostController from "../Post/PostController.js";
import UserState from "../UserState.js";
import "./feed.scss";

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
    href: "/feed/news",
    text: "НОВОСТИ",
  },
  {
    href: "/feed/groups",
    text: "СООБЩЕСТВА",
  },
  {
    href: "/feed/friends",
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
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.postController = new PostController(router);

    this.eventBus.addEventListener(
      "getPostsSuccess",
      this.renderNewsPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "getFriendsPostSuccess",
      this.renderFriendsPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "getGroupsPostSuccess",
      this.renderGroupsPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "publishedPostSuccess",
      this.renderPublishedSuccess.bind(this),
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
      this.feedMain.scrollHeight - this.feedMain.scrollTop <=
        3 * window.innerHeight &&
      !this.isWaitPosts
    ) {
      if (!this.isAllMyPosts) {
        switch (this.path) {
          case "news":
            this.eventBus.emit("readyRenderPosts", this.lastPostMyId);
            break;
          case "friends":
            this.eventBus.emit("readyRenderFriendsPosts", this.lastPostMyId);
            break;
          case "groups":
            this.eventBus.emit("readyRenderGroupsPosts", this.lastPostMyId);
            break;
        }
      } else {
        if (!this.isAllPosts) {
          if (this.path === "news") {
            this.eventBus.emit("readyRenderAllPosts", this.lastPostAllId);
          }
        }
      }
      this.isWaitPosts = true;
    }
  }

  /**
   * Renders main part of feed
   *
   * @param {string} path - The next path
   */
  renderFeedMain(path) {
    let { userId, avatar, firstName, lastName } = UserState;
    const template = require("./feedMain.hbs");
    avatar = avatar || "default_avatar.png";
    const userAvatar = `${staticUrl}/user-avatars/${avatar}`;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    this.mainElement = document.getElementById("activity");
    this.mainElement.innerHTML = template({ userId, userAvatar, rightSidebar });
    this.lastPostMyId = 0;
    this.lastPostAllId = 0;
    this.isAllMyPosts = false;
    this.isAllPosts = false;
    this.isWaitPosts = true;
    this.feedMain = document.getElementById("feed-main");

    const newsTextarea = document.getElementById("news-content__textarea");

    newsTextarea.addEventListener("input", () => {
      newsTextarea.style.height = "auto";
      newsTextarea.style.height = newsTextarea.scrollHeight - 4 + "px";
    });

    this.feedMain.onscroll = this.checksNewPosts.bind(this);

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
          img.classList.add("news-img-content__img", "post-content__img");

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

        document.getElementById("news-img-content").innerHTML = "";
        const textarea = document.getElementById("news-content__textarea");
        textarea.value = "";
        textarea.style.height = "60px";
        fileInput.files = null;
      });
    }

    this.path = path.section;

    this.postsElement = document.getElementById("posts");

    switch (this.path) {
      case "news":
        this.eventBus.emit("readyRenderPosts", this.lastPostMyId);
        break;
      case "friends":
        document.getElementById("");
        this.eventBus.emit("readyRenderFriendsPosts", this.lastPostAllId);
        break;
      case "groups":
        this.eventBus.emit("readyRenderGroupsPosts", this.lastPostAllId);
        break;
    }
  }

  /**
   * Renders post on feed
   *
   * @param {PostInfo[]} posts - The posts to feed
   */
  renderNewsPosts({ posts, isMy }) {
    this.isWaitPosts = false;

    document.getElementById("posts-sceleton")?.remove();

    if (posts.length > 0) {
      posts.forEach((elem) => {
        if (isMy) {
          if (elem.post.postId < this.lastPostMyId || this.lastPostMyId === 0) {
            this.lastPostMyId = elem.post.postId;
          }
        } else {
          if (
            elem.post.postId < this.lastPostAllId ||
            this.lastPostAllId === 0
          ) {
            this.lastPostAllId = elem.post.postId;
          }
        }
      });
      posts.forEach((elem) => {
        let author = elem.author;
        if (elem.group) {
          author = {
            name: elem.group?.name,
            groupId: elem.group?.id,
            avatar: elem.group?.avatar,
          };
        }
        this.postController.renderPostView({
          isGroup: elem.group,
          post: elem.post,
          author,
        });
      });
    } else {
      if (isMy) {
        this.isAllMyPosts = true;
      } else {
        document
          .getElementById("no-more-posts")
          .classList.replace("no-more-posts_hidden", "no-more-posts_visible");
      }
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
   * Renders friend's posts
   *
   * @param {PostInfo[]} posts
   */
  renderFriendsPosts(posts) {
    this.isWaitPosts = false;

    document.getElementById("posts-sceleton")?.remove();

    if (posts.length > 0) {
      posts.forEach((elem) => {
        if (elem.post.postId < this.lastPostMyId || this.lastPostMyId === 0) {
          this.lastPostMyId = elem.post.postId;
        }
      });
      posts.forEach((elem) => {
        this.postController.renderPostView({
          post: elem.post,
          author: elem.author,
        });
      });
    } else {
      this.isAllMyPosts = true;
      this.isAllPosts = true;
      document
        .getElementById("no-more-posts")
        .classList.replace("no-more-posts_hidden", "no-more-posts_visible");
    }

    if (!this.isAllMyPosts) {
      const imgSceleton = document.createElement("img");

      imgSceleton.classList.add("sceleton-img");
      imgSceleton.setAttribute("id", "posts-sceleton");
      imgSceleton.setAttribute("src", "dist/images/loading.png");

      this.postsElement.appendChild(imgSceleton);
    }

    this.checksNewPosts();
  }

  /**
   * Renders groups' posts
   *
   * @param {PostInfo[]} posts
   */
  renderGroupsPosts(posts) {
    this.isWaitPosts = false;

    document.getElementById("posts-sceleton")?.remove();

    if (posts.length > 0) {
      posts.forEach((elem) => {
        if (elem.post.postId < this.lastPostMyId || this.lastPostMyId === 0) {
          this.lastPostMyId = elem.post.postId;
        }
      });
      posts.forEach((elem) => {
        this.postController.renderPostView({
          isGroup: true,
          post: elem.post,
          author: {
            name: elem.group?.name,
            groupId: elem.group?.id,
            avatar: elem.group?.avatar,
          },
        });
      });
    } else {
      this.isAllMyPosts = true;
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
   * The post to be published
   *
   * @param {PostInfo} postInfo
   */
  renderPublishedSuccess(postInfo) {
    const { post, author } = postInfo;
    this.postController.renderPostView({
      post: post,
      author: author,
      publish: true,
    });
  }

  deleteScrollListener() {
    document.removeEventListener("scroll", this.checksNewPosts.bind(this));
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
