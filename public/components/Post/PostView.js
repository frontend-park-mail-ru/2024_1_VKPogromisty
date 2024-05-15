import BaseView from "../../MVC/BaseView.js";
import { formatFullDate } from "../../modules/dateRemaking.js";
import { API_URL } from "/public/modules/consts.js";
import UserState from "../UserState.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import "./post.scss";
import { customConfirm } from "../../modules/windows.js";
import {
  buildComponent,
  appendChildren,
  modifyComponent,
} from "../createComponent.js";

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

const imageTypes = ["png", "jpg", "jpeg", "webp", "gif"];
const staticUrl = `${API_URL}/static`;
const typeFile = (file) => {
  const parts = file.split(".");
  return parts[parts.length - 1];
};

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
      this.renderFriendPost.bind(this),
    );
    this.eventBus.addEventListener(
      "commentsGotSuccess",
      this.renderComments.bind(this),
    );
    this.eventBus.addEventListener(
      "commentDeletedSuccess",
      this.deleteComment.bind(this),
    );
    this.eventBus.addEventListener(
      "commentAddedSuccess",
      this.addComment.bind(this),
    );
    this.eventBus.addEventListener(
      "commentLikedSuccess",
      this.likedComment.bind(this),
    );
    this.eventBus.addEventListener(
      "commentUnlikedSuccess",
      this.unlikedComment.bind(this),
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

    this.mainElement = document.getElementById("activity");

    this.mainElement.innerHTML = template({});

    this.commentsElement = document.getElementById("comments");
    this.postId = postId;

    this.eventBus.emit("readyRenderPost", { postId: this.postId });
    this.eventBus.emit("readyRenderComments", this.postId);
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
    const isPostPage = window.location.pathname.startsWith("/post");
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

    const newPost = this.makePost(
      null,
      post,
      author,
      avatar,
      isMe,
      hasUpdated,
      isPostPage,
    );

    if (publish) {
      this.mainElement.insertBefore(
        newPost,
        this.mainElement.firstElementChild,
      );
    } else {
      this.mainElement.appendChild(newPost);
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
    const isPostPage = window.location.pathname.startsWith("/post");
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

    const newPost = this.makePost(
      group,
      post,
      null,
      avatar,
      isMe,
      hasUpdated,
      isPostPage,
    );

    if (publish) {
      this.mainElement.insertBefore(
        newPost,
        this.mainElement.firstElementChild,
      );
    } else {
      this.mainElement.appendChild(newPost);
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
  }

  /**
   * Makes a new post
   *
   * @param {*} isGroup
   * @param {*} post
   * @param {*} author
   * @param {*} avatar
   * @param {*} isMe
   * @param {*} hasUpdated
   * @returns
   */
  makePost(group, post, author, avatar, isMe, hasUpdated, isPostPage) {
    const isGroup = group !== null;
    const postAuthor = buildComponent("div", [], ["post-author"]);
    const postAuthorHref = isGroup
      ? `/group/${group.id}`
      : `/profile/${author.authorId}`;
    const postAuthorImage = isGroup
      ? `${staticUrl}/group-avatars/${group.avatar}`
      : `${staticUrl}/user-avatars/${author.avatar}`;

    appendChildren(postAuthor, [
      appendChildren(buildComponent("a", [["href", postAuthorHref]]), [
        buildComponent(
          "img",
          [["src", postAuthorImage]],
          ["post-author__user-avatar-img"],
        ),
      ]),
    ]);
    const postAuthorTime = appendChildren(
      buildComponent(
        "div",
        [["id", `post-author-time-${post.postId}`]],
        ["post-author-time"],
      ),
      [
        buildComponent(
          "span",
          [],
          ["post-author-time__created-at-span"],
          post.createdAt,
        ),
      ],
    );

    if (hasUpdated) {
      appendChildren(postAuthorTime, [
        buildComponent(
          "img",
          [["src", "dist/images/dot.png"]],
          ["post-author-time__dot-img"],
        ),
        buildComponent(
          "span",
          [["id", `edited-${post.postId}`]],
          ["post-author-time__last-time-span"],
          post.updatedAt,
        ),
      ]);
    }

    const postAuthorNameSpan = isGroup
      ? group.name
      : `${author.firstName} ${author.lastName}`;

    appendChildren(postAuthor, [
      appendChildren(buildComponent("div", [], ["post-author-info"]), [
        appendChildren(
          buildComponent(
            "a",
            [["href", postAuthorHref]],
            ["post-author__name-href"],
          ),
          [
            buildComponent(
              "span",
              [],
              ["post-author__name-span"],
              postAuthorNameSpan,
            ),
          ],
        ),
        postAuthorTime,
      ]),
    ]);

    const postContent = appendChildren(
      buildComponent(
        "div",
        [["id", `post-content-${post.postId}`]],
        ["post-content"],
      ),
      [
        buildComponent(
          "textarea",
          [["id", `textarea-${post.postId}`]],
          ["post-content__text-span"],
          post.content,
        ),
      ],
    );

    post.attachments?.forEach((elem) => {
      if (imageTypes.includes(typeFile(elem))) {
        appendChildren(postContent, [
          buildComponent(
            "img",
            [["src", `${staticUrl}/post-attachments/${elem}`]],
            ["post-content__img"],
          ),
        ]);
      } else {
        appendChildren(postContent, [
          appendChildren(buildComponent("div", [], ["post-file-content"]), [
            appendChildren(
              buildComponent(
                "a",
                [
                  ["target", "_blank"],
                  ["rel", "noopener"],
                  ["href", `/${elem}`],
                  ["download", elem],
                ],
                ["news-file-content__a"],
              ),
              [
                buildComponent(
                  "img",
                  [["src", "dist/images/document.png"]],
                  ["news-file-content__img"],
                ),
              ],
            ),
          ]),
        ]);
      }
    });

    const classIsLiked = post.isLikedByMe
      ? "reactions__heart-img_liked"
      : "reactions__heart-img_unliked";
    const sourceIsLiked = post.isLikedByMe
      ? "dist/images/filled-heart.png"
      : "dist/images/heart.png";
    const imgIsLiked = buildComponent(
      "img",
      [
        ["data-id", post.postId],
        ["src", sourceIsLiked],
      ],
      [classIsLiked],
    );
    const showCommentsButton = appendChildren(
      buildComponent("button", [], ["show-comments"]),
      [
        buildComponent(
          "img",
          [["src", "dist/images/messenger.png"]],
          ["show-comments__messenger-img"],
        ),
      ],
    );

    showCommentsButton.addEventListener("click", () => {
      this.router.redirect(`/post/${post.postId}`);
    });

    if (post.isLikedByMe) {
      imgIsLiked.addEventListener("mouseenter", () => {
        imgIsLiked.setAttribute("src", "dist/images/broken-heart.png");
        imgIsLiked.style.width = "28px";
        imgIsLiked.style.height = "28px";
      });
      imgIsLiked.addEventListener("mouseleave", () => {
        imgIsLiked.setAttribute("src", "dist/images/filled-heart.png");
        imgIsLiked.style.width = "25px";
        imgIsLiked.style.height = "25px";
      });
      imgIsLiked.addEventListener("click", () => {
        this.eventBus.emit("clickedUnlikePost", +imgIsLiked.dataset.id);
      });
    } else {
      imgIsLiked.addEventListener("mouseenter", () => {
        imgIsLiked.setAttribute("src", "dist/images/filled-heart.png");
        imgIsLiked.style.width = "28px";
        imgIsLiked.style.height = "28px";
      });
      imgIsLiked.addEventListener("mouseleave", () => {
        imgIsLiked.setAttribute("src", "dist/images/heart.png");
        imgIsLiked.style.width = "25px";
        imgIsLiked.style.height = "25px";
      });
      imgIsLiked.addEventListener("click", () => {
        this.eventBus.emit("clickedLikePost", +imgIsLiked.dataset.id);
      });
    }

    const editImg = buildComponent(
      "img",
      [
        ["id", `edit-img-${post.postId}`],
        ["data-id", post.postId],
        ["src", "dist/images/edit.png"],
      ],
      ["post-author__edit-img"],
    );
    const trashCan = buildComponent(
      "img",
      [
        ["id", `trash-basket-${post.postId}`],
        ["data-id", post.postId],
        ["src", "dist/images/trash-can.png"],
      ],
      ["post-author__trash-basket-img"],
    );

    editImg.addEventListener("click", () => {
      const parent = editImg.parentNode;
      const nextElem = editImg.nextElementSibling;
      const id = editImg.dataset.id;
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
        this.eventBus.emit("canceledUpdatePost", {
          postId: id,
          isCanceled: true,
        });
      });

      parent.appendChild(ok);
      parent.appendChild(cancel);
      editImg.style["display"] = "none";
      nextElem.style["display"] = "none";
    });

    trashCan.addEventListener("click", () => {
      customConfirm(
        (() => {
          this.eventBus.emit("clickedDeleteButton", trashCan.dataset.id);
        }).bind(this),
        "Удалить пост?",
        "Вы уверены, что хотите удалить пост?",
        "Удалить",
        "Отмена",
      );
    });

    const postGiveComment = buildComponent("div");
    if (isPostPage) {
      modifyComponent(postGiveComment, [], ["post-give-comment"]);
      const commentInput = buildComponent(
        "input",
        [
          ["id", `user-comment-${post.postId}`],
          ["type", "text"],
          ["placeholder", "Оставить комментарий"],
        ],
        ["post-footer__input"],
      );

      const postComment = buildComponent(
        "img",
        [
          ["src", "dist/images/send.png"],
          ["data-id", post.postId],
        ],
        ["post-comment-img"],
      );
      postComment.addEventListener("click", () => {
        if (commentInput.value.trim() !== "") {
          this.eventBus.emit("postCommentAdded", {
            postId: post.postId,
            content: commentInput.value,
          });
          commentInput.value = "";
        }
      });

      appendChildren(postGiveComment, [
        appendChildren(buildComponent("div", [], ["post-footer"]), [
          buildComponent(
            "img",
            [["src", `${staticUrl}/user-avatars/${avatar}`]],
            ["post-author__user-avatar-img"],
          ),
          commentInput,
        ]),
        appendChildren(buildComponent("div", [], ["comment-buttons"]), [
          buildComponent(
            "img",
            [["src", "dist/images/attach-paperclip-symbol.png"]],
            ["comment-buttons__paper-clip-img"],
          ),
          postComment,
        ]),
      ]);
    }

    return appendChildren(
      buildComponent("div", [["id", `post-${post.postId}`]], ["post"]),
      [
        appendChildren(buildComponent("div", [], ["post-header"]), [
          postAuthor,
          appendChildren(
            buildComponent(
              "div",
              [["id", `post-menu-${post.postId}`]],
              ["post-menu"],
            ),
            isMe ? [editImg, trashCan] : null,
          ),
        ]),
        postContent,
        appendChildren(buildComponent("div", [], ["post-reaction"]), [
          appendChildren(buildComponent("div", [], ["reactions"]), [
            appendChildren(buildComponent("button", [], ["reactions-like"]), [
              imgIsLiked,
            ]),
            buildComponent("span", [], ["likes-count__span"], post.likesCount),
            showCommentsButton,
            buildComponent("span", [], ["show-comments-label__span"]),
          ]),
        ]),
        postGiveComment,
      ],
    );
  }

  /**
   * Renders comments of post on the page
   *
   * @param {*} comments
   */
  renderComments(comments) {
    if (comments.length > 0) {
      document
        .getElementById("no-comments")
        .classList.remove("no-comments_visible");
      comments.forEach(({ comment, author }) => {
        const isMe = author.userId === UserState.userId;
        const hasUpdated = comment.createdAt !== comment.updatedAt;

        comment.isLikedByMe = comment.likedBy?.includes(UserState.userId);
        comment.likesCount = 0;
        if (comment.likedBy) {
          comment.likesCount = comment.likedBy.length;
        }
        comment.createdAt = formatFullDate(comment.createdAt);
        comment.updatedAt = formatFullDate(comment.updatedAt);

        this.commentsElement.appendChild(
          this.makeComment(comment, hasUpdated, isMe, author),
        );
      });
    } else {
      document
        .getElementById("no-comments")
        .classList.add("no-comments_visible");
    }
  }

  /**
   * Adds new comment to the page
   *
   * @param {*} param0
   */
  addComment({ comment }) {
    const isMe = true;
    const hasUpdated = comment.createdAt !== comment.updatedAt;
    comment.createdAt = formatFullDate(comment.createdAt);
    comment.updatedAt = formatFullDate(comment.updatedAt);
    comment.likesCount = 0;
    comment.isLikedByMe = false;
    this.commentsElement.insertBefore(
      this.makeComment(comment, hasUpdated, isMe, UserState),
      this.commentsElement.firstElementChild,
    );
  }

  /**
   * Creates the comment
   *
   * @param {*} comment
   * @param {*} hasUpdated
   * @param {*} isMe
   * @param {*} author
   * @returns
   */
  makeComment(comment, hasUpdated, isMe, author) {
    const commentAuthorTime = appendChildren(
      buildComponent(
        "div",
        [["id", `comment-author-time-${comment.id}`]],
        ["comment-author-time"],
      ),
      [
        buildComponent(
          "span",
          [],
          ["comment-author-time__created-at-span"],
          comment.createdAt,
        ),
      ],
    );
    if (hasUpdated) {
      appendChildren(commentAuthorTime, [
        buildComponent(
          "img",
          [["src", "dist/images/dot.png"]],
          ["comment-author-time__dot-img"],
        ),
        buildComponent(
          "span",
          [["id", `edited-${comment.id}`]],
          ["comment-author-time__last-time-span"],
          comment.updatedAt,
        ),
      ]);
    }

    const reactionsHeart = comment.isLikedByMe
      ? buildComponent(
          "img",
          [
            ["src", "dist/images/filled-heart.png"],
            ["data-id", comment.id],
          ],
          ["reactions__heart-img_liked"],
        )
      : buildComponent(
          "img",
          [
            ["src", "dist/images/heart.png"],
            ["data-id", comment.id],
          ],
          ["reactions__heart-img_unliked"],
        );
    const commentRedact = buildComponent(
      "div",
      [["id", `comment-redact-${comment.id}`]],
      ["comment-redact"],
    );

    if (isMe) {
      const trashCanImg = buildComponent(
        "img",
        [
          ["src", "dist/images/trash-can.png"],
          ["data-id", comment.id],
          ["id", `trash-basket-${comment.id}`],
        ],
        ["comment-author__trash-basket-img"],
      );

      appendChildren(commentRedact, [
        buildComponent(
          "img",
          [
            ["src", "dist/images/edit.png"],
            ["data-id", comment.id],
            ["id", `edit-img-${comment.id}`],
          ],
          ["comment-author__edit-img"],
        ),
        trashCanImg,
      ]);

      trashCanImg.addEventListener("click", () => {
        customConfirm(
          (() => {
            this.eventBus.emit("clickedDeleteComment", {
              commentId: trashCanImg.dataset.id,
            });
          }).bind(this),
          "Удалить комментарий?",
          "Вы уверены, что хотите удалить комментарий?",
          "Удалить",
          "Отмена",
        );
      });
    }

    if (comment.isLikedByMe) {
      reactionsHeart.addEventListener("mouseenter", () => {
        reactionsHeart.setAttribute("src", "dist/images/broken-heart.png");
        reactionsHeart.style.width = "28px";
        reactionsHeart.style.height = "28px";
      });
      reactionsHeart.addEventListener("mouseleave", () => {
        reactionsHeart.setAttribute("src", "dist/images/filled-heart.png");
        reactionsHeart.style.width = "25px";
        reactionsHeart.style.height = "25px";
      });
      reactionsHeart.addEventListener("click", () => {
        this.eventBus.emit("clickedUnlikeComment", +reactionsHeart.dataset.id);
      });
    } else {
      reactionsHeart.addEventListener("mouseenter", () => {
        reactionsHeart.setAttribute("src", "dist/images/filled-heart.png");
        reactionsHeart.style.width = "28px";
        reactionsHeart.style.height = "28px";
      });
      reactionsHeart.addEventListener("mouseleave", () => {
        reactionsHeart.setAttribute("src", "dist/images/heart.png");
        reactionsHeart.style.width = "25px";
        reactionsHeart.style.height = "25px";
      });
      reactionsHeart.addEventListener("click", () => {
        this.eventBus.emit("clickedLikeComment", +reactionsHeart.dataset.id);
      });
    }

    return appendChildren(
      buildComponent("div", [["id", `comment-${comment.id}`]], ["comment"]),
      [
        appendChildren(buildComponent("div", [], ["comment-content"]), [
          appendChildren(buildComponent("div", [], ["comment-author"]), [
            appendChildren(
              buildComponent("a", [["href", `/profile/${author.userId}`]], []),
              [
                buildComponent(
                  "img",
                  [["src", `${staticUrl}/user-avatars/${author.avatar}`]],
                  ["comment-author__user-avatar-img"],
                ),
              ],
            ),
            appendChildren(buildComponent("div", [], ["comment-author-info"]), [
              appendChildren(
                buildComponent(
                  "a",
                  [["href", `/profile/${author.userId}`]],
                  ["comment-author__name-href"],
                ),
                [
                  buildComponent(
                    "span",
                    [],
                    ["comment-author__name-span"],
                    `${author.firstName} ${author.lastName}`,
                  ),
                ],
              ),
              appendChildren(buildComponent("div", [], ["comment-info"]), [
                commentAuthorTime,
                buildComponent(
                  "span",
                  [["id", `textarea-${comment.id}`]],
                  ["comment-content__text-span"],
                  comment.content,
                ),
              ]),
            ]),
          ]),
          appendChildren(
            buildComponent(
              "div",
              [["id", `comment-menu-${comment.id}`]],
              ["comment-menu"],
            ),
            [
              appendChildren(buildComponent("div", [], ["comment-reactions"]), [
                appendChildren(
                  buildComponent("button", [], ["reactions-like"]),
                  [reactionsHeart],
                ),
                buildComponent(
                  "span",
                  [],
                  ["comment__likes-count-span"],
                  `${comment.likesCount}`,
                ),
              ]),
              commentRedact,
            ],
          ),
        ]),
      ],
    );
  }

  /**
   * Deletes the comment
   *
   * @param {number} commentId - The number of comment
   */
  deleteComment(commentId) {
    document.getElementById(`comment-${commentId}`)?.remove();
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
   * Set comment liked
   *
   * @param {number} commentId - The ID of current comment
   */
  likedComment(commentId) {
    const likedCommentParent = document.querySelector(
      `#comment-${commentId} .reactions__heart-img_unliked`,
    ).parentElement;
    const likedComment = document.createElement("img");
    likedComment.setAttribute("src", "dist/images/filled-heart.png");
    likedComment.dataset.id = commentId;
    likedComment.classList.add("reactions__heart-img_liked");
    const likesCount = document.querySelector(
      `#comment-${commentId} .comment__likes-count-span`,
    );
    likesCount.innerHTML = +likesCount.innerHTML + 1;
    likedCommentParent.replaceChild(
      likedComment,
      likedCommentParent.firstElementChild,
    );

    likedComment.addEventListener("mouseenter", () => {
      likedComment.setAttribute("src", "dist/images/broken-heart.png");
      likedComment.style.width = "28px";
      likedComment.style.height = "28px";
    });
    likedComment.addEventListener("mouseleave", () => {
      likedComment.setAttribute("src", "dist/images/filled-heart.png");
      likedComment.style.width = "25px";
      likedComment.style.height = "25px";
    });
    likedComment.addEventListener("click", () => {
      this.eventBus.emit("clickedUnlikeComment", likedComment.dataset.id);
    });
  }

  /**
   * Set comment unliked
   *
   * @param {number} commentId - The ID of current comment
   */
  unlikedComment(commentId) {
    const unlikedCommentParent = document.querySelector(
      `#comment-${commentId} .reactions__heart-img_liked`,
    ).parentElement;
    const unlikedComment = document.createElement("img");
    unlikedComment.dataset.id = commentId;
    unlikedComment.setAttribute("src", "dist/images/heart.png");
    unlikedComment.classList.add("reactions__heart-img_unliked");
    const likesCount = document.querySelector(
      `#comment-${commentId} .comment__likes-count-span`,
    );
    likesCount.innerHTML = +likesCount.innerHTML - 1;
    unlikedCommentParent.replaceChild(
      unlikedComment,
      unlikedCommentParent.firstElementChild,
    );

    unlikedComment.addEventListener("mouseenter", () => {
      unlikedComment.setAttribute("src", "dist/images/filled-heart.png");
      unlikedComment.style.width = "28px";
      unlikedComment.style.height = "28px";
    });
    unlikedComment.addEventListener("mouseleave", () => {
      unlikedComment.setAttribute("src", "dist/images/heart.png");
      unlikedComment.style.width = "25px";
      unlikedComment.style.height = "25px";
    });
    unlikedComment.addEventListener("click", () => {
      this.eventBus.emit("clickedLikeComment", unlikedComment.dataset.id);
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
