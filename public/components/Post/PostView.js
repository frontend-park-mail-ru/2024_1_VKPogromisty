import BaseView from "./public/MVC/BaseView.js";
import { formatFullDate } from "../../modules/dateRemaking.js";
import { API_URL } from "/public/modules/consts.js";

/**
 * A User structure
 * @typedef {Object} User
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
 * A Message structure
 * @typedef {Object} Message
 * @property {number} id - The ID of message
 * @property {string} createdAt - The date of creating accout
 * @property {string} content - The text content of current message
 * @property {number} receiverId - The ID of receiver current message
 * @property {number} senderId - The ID of sender current message
 * @property {string} updatedAt - The last date of updating
 */

/**
 * A Dialog structure
 * @typedef {Object} Dialog
 * @property {Message} lastMessage - The last message of dialog
 * @property {User} user1 - The first user
 * @property {User} user2 - The second user
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
  constructor(eventBus, userState) {
    super(eventBus);

    this.userState = userState;
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
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  /**
   * Renders main part of page of messenger
   */
  renderPost({ post, author, publish }) {
    const { userId, avatar } = this.userState;

    const template = Handlebars.templates["post.hbs"];
    const postId = post.postId;

    const isMe = Number(author.userId) === Number(userId);
    const hasUpdated = post.createdAt !== post.updatedAt;

    post.createdAt = formatFullDate(post.createdAt);
    post.updatedAt = `обновлено ${formatFullDate(post.updatedAt)}`;

    this.mainElement = document.getElementById("posts");

    if (publish) {
      this.mainElement.innerHTML =
        template({ post, author, avatar, staticUrl, isMe, hasUpdated }) +
        this.mainElement.innerHTML;
    } else {
      this.mainElement.innerHTML += template({
        post,
        author,
        avatar,
        staticUrl,
        isMe,
        hasUpdated,
      });
    }

    const textarea = document.getElementById(`textarea-${postId}`);
    textarea.style.height = textarea.scrollHeight - 4 + "px";

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

    document.querySelectorAll(".post-author__edit-img").forEach((elem) => {
      elem.addEventListener("click", () => {
        const parent = elem.parentNode;
        const nextElem = elem.nextElementSibling;
        const id = elem.dataset.id;
        const textarea = document.getElementById(`textarea-${id}`);

        textarea.removeAttribute("readonly");
        textarea.addEventListener("input", () => {
          textarea.style.height = "auto";
          textarea.style.height = textarea.scrollHeight - 4 + "px";
        });
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
            postId: id,
          });
        });

        const cancel = document.createElement("img");
        cancel.classList.add("post-author__cancel-img");
        cancel.setAttribute("data-id", id);
        cancel.setAttribute("src", "../static/images/cancel.png");
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
          this.eventBus.emit("clickedDeleteButton", elem.dataset.id);
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
    postMenu.firstElementChild.style.display = "block";
    postMenu.firstElementChild.nextElementSibling.style.display = "block";
  }

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

  deletePost(postId) {
    const post = document.getElementById(`post-${postId}`);

    if (post) {
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

export default PostView;
