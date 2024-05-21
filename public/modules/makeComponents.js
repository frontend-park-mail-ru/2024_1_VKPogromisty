import {
  buildComponent,
  appendChildren,
  modifyComponent,
} from "../components/createComponent.js";
import { customConfirm } from "/public/modules/windows.js";
import { API_URL } from "/public/modules/consts.js";

const imageTypes = ["png", "jpg", "jpeg", "webp", "gif"];
const staticUrl = `${API_URL}/static`;
const typeFile = (file) => {
  const parts = file.split(".");
  return parts[parts.length - 1];
};
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
export function makePost(
  group,
  post,
  author,
  avatar,
  isMe,
  hasUpdated,
  isPostPage,
  eventBus,
) {
  const isGroup = group !== null;
  const postAuthor = buildComponent("div", {}, ["post-author"]);
  const postAuthorHref = isGroup
    ? `/group/${group.id}`
    : `/profile/${author.authorId}`;
  const postAuthorImage = isGroup
    ? `${staticUrl}/group-avatars/${group.avatar}`
    : `${staticUrl}/user-avatars/${author.avatar}`;

  appendChildren(postAuthor, [
    appendChildren(buildComponent("a", { href: postAuthorHref }), [
      buildComponent("img", { src: postAuthorImage }, [
        "post-author__user-avatar-img",
      ]),
    ]),
  ]);
  const postAuthorTime = appendChildren(
    buildComponent("div", { id: `post-author-time-${post.postId}` }, [
      "post-author-time",
    ]),
    [
      buildComponent(
        "span",
        {},
        ["post-author-time__created-at-span"],
        post.createdAt,
      ),
    ],
  );

  if (hasUpdated) {
    appendChildren(postAuthorTime, [
      buildComponent("img", { src: "dist/images/dot.png" }, [
        "post-author-time__dot-img",
      ]),
      buildComponent(
        "span",
        { id: `edited-${post.postId}` },
        ["post-author-time__last-time-span"],
        post.updatedAt,
      ),
    ]);
  }

  const postAuthorNameSpan = isGroup
    ? group.name
    : `${author.firstName} ${author.lastName}`;

  appendChildren(postAuthor, [
    appendChildren(buildComponent("div", {}, ["post-author-info"]), [
      appendChildren(
        buildComponent("a", { href: postAuthorHref }, [
          "post-author__name-href",
        ]),
        [
          buildComponent(
            "span",
            {},
            ["post-author__name-span"],
            postAuthorNameSpan,
          ),
        ],
      ),
      postAuthorTime,
    ]),
  ]);

  const postContent = appendChildren(
    buildComponent("div", { id: `post-content-${post.postId}` }, [
      "post-content",
    ]),
    [
      buildComponent(
        "textarea",
        { id: `textarea-${post.postId}` },
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
          { src: `${staticUrl}/post-attachments/${elem}` },
          ["post-content__img"],
        ),
      ]);
    } else {
      appendChildren(postContent, [
        appendChildren(buildComponent("div", {}, ["post-file-content"]), [
          appendChildren(
            buildComponent(
              "a",
              {
                target: "_blank",
                rel: "noopener",
                href: `${staticUrl}/post-attachments/${elem}`,
                download: elem,
              },
              ["news-file-content__a"],
            ),
            [
              buildComponent("img", { src: "dist/images/document.png" }, [
                "news-file-content__img",
              ]),
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
    {
      "data-id": post.postId,
      src: sourceIsLiked,
    },
    [classIsLiked],
  );
  const showCommentsButton = appendChildren(
    buildComponent("button", {}, ["show-comments"]),
    [
      buildComponent("img", { src: "dist/images/messenger.png" }, [
        "show-comments__messenger-img",
      ]),
    ],
  );

  if (isPostPage) {
    showCommentsButton.style.display = "none";
  }

  showCommentsButton.addEventListener("click", () => {
    eventBus.emit("needRenderPostMain", post.postId);
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
      eventBus.emit("clickedUnlikePost", +imgIsLiked.dataset.id);
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
      eventBus.emit("clickedLikePost", +imgIsLiked.dataset.id);
    });
  }

  const editImg = buildComponent(
    "img",
    {
      id: `edit-img-${post.postId}`,
      "data-id": post.postId,
      src: "dist/images/edit.png",
    },
    ["post-author__edit-img"],
  );
  const trashCan = buildComponent(
    "img",
    {
      id: `trash-basket-${post.postId}`,
      "data-id": post.postId,
      src: "dist/images/trash-can.png",
    },
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

      eventBus.emit("clickedUpdatePost", {
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
      eventBus.emit("canceledUpdatePost", {
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
        eventBus.emit("clickedDeleteButton", trashCan.dataset.id);
      }).bind(this),
      "Удалить пост?",
      "Вы уверены, что хотите удалить пост?",
      "Удалить",
      "Отмена",
    );
  });

  const postGiveComment = buildComponent("div", {});
  if (isPostPage) {
    modifyComponent(postGiveComment, [], ["post-give-comment"]);
    const commentInput = buildComponent(
      "input",
      {
        id: `user-comment-${post.postId}`,
        type: "text",
        placeholder: "Оставить комментарий",
      },
      ["post-footer__input"],
    );

    const postComment = buildComponent(
      "img",
      {
        src: "dist/images/send.png",
        "data-id": post.postId,
      },
      ["post-comment-img"],
    );
    postComment.addEventListener("click", () => {
      if (commentInput.value.trim() !== "") {
        eventBus.emit("postCommentAdded", {
          postId: post.postId,
          content: commentInput.value,
        });
        commentInput.value = "";
      }
    });

    appendChildren(postGiveComment, [
      appendChildren(buildComponent("div", {}, ["post-footer"]), [
        buildComponent("img", { src: `${staticUrl}/user-avatars/${avatar}` }, [
          "post-author__user-avatar-img",
        ]),
        commentInput,
      ]),
      appendChildren(buildComponent("div", {}, ["comment-buttons"]), [
        buildComponent(
          "img",
          { src: "dist/images/attach-paperclip-symbol.png" },
          ["comment-buttons__paper-clip-img"],
        ),
        postComment,
      ]),
    ]);
  }

  return appendChildren(
    buildComponent(
      "div",
      { id: isPostPage ? `single-post-${post.postId}` : `post-${post.postId}` },
      ["post"],
    ),
    [
      appendChildren(buildComponent("div", {}, ["post-header"]), [
        postAuthor,
        appendChildren(
          buildComponent("div", { id: `post-menu-${post.postId}` }, [
            "post-menu",
          ]),
          isMe ? [editImg, trashCan] : null,
        ),
      ]),
      postContent,
      appendChildren(buildComponent("div", {}, ["post-reaction"]), [
        appendChildren(buildComponent("div", {}, ["reactions"]), [
          appendChildren(buildComponent("button", {}, ["reactions-like"]), [
            imgIsLiked,
          ]),
          buildComponent("span", {}, ["likes-count__span"], post.likesCount),
          showCommentsButton,
          buildComponent("span", {}, ["show-comments-label__span"]),
        ]),
      ]),
      postGiveComment,
    ],
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
export function makeComment(comment, hasUpdated, isMe, author, eventBus) {
  const commentAuthorTime = appendChildren(
    buildComponent("div", { id: `comment-author-time-${comment.id}` }, [
      "comment-author-time",
    ]),
    [
      buildComponent(
        "span",
        {},
        ["comment-author-time__created-at-span"],
        comment.createdAt,
      ),
    ],
  );
  if (hasUpdated) {
    appendChildren(commentAuthorTime, [
      buildComponent("img", { src: "dist/images/dot.png" }, [
        "comment-author-time__dot-img",
      ]),
      buildComponent(
        "span",
        { id: `edited-${comment.id}` },
        ["comment-author-time__last-time-span"],
        comment.updatedAt,
      ),
    ]);
  }

  const reactionsHeart = comment.isLikedByMe
    ? buildComponent(
        "img",
        {
          src: "dist/images/filled-heart.png",
          "data-id": comment.id,
        },
        ["reactions__heart-img_liked"],
      )
    : buildComponent(
        "img",
        {
          src: "dist/images/heart.png",
          "data-id": comment.id,
        },
        ["reactions__heart-img_unliked"],
      );
  const commentRedact = buildComponent(
    "div",
    { id: `comment-redact-${comment.id}` },
    ["comment-redact"],
  );

  if (isMe) {
    const trashCanImg = buildComponent(
      "img",
      {
        src: "dist/images/trash-can.png",
        "data-id": comment.id,
        id: `trash-basket-${comment.id}`,
      },
      ["comment-author__trash-basket-img"],
    );

    appendChildren(commentRedact, [
      buildComponent(
        "img",
        {
          src: "dist/images/edit.png",
          "data-id": comment.id,
          id: `edit-img-${comment.id}`,
        },
        ["comment-author__edit-img"],
      ),
      trashCanImg,
    ]);

    trashCanImg.addEventListener("click", () => {
      customConfirm(
        (() => {
          eventBus.emit("clickedDeleteComment", {
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
      reactionsHeart.style.width = "25px";
      reactionsHeart.style.height = "25px";
    });
    reactionsHeart.addEventListener("mouseleave", () => {
      reactionsHeart.setAttribute("src", "dist/images/filled-heart.png");
      reactionsHeart.style.width = "22px";
      reactionsHeart.style.height = "22px";
    });
    reactionsHeart.addEventListener("click", () => {
      eventBus.emit("clickedUnlikeComment", +reactionsHeart.dataset.id);
    });
  } else {
    reactionsHeart.addEventListener("mouseenter", () => {
      reactionsHeart.setAttribute("src", "dist/images/filled-heart.png");
      reactionsHeart.style.width = "25px";
      reactionsHeart.style.height = "25px";
    });
    reactionsHeart.addEventListener("mouseleave", () => {
      reactionsHeart.setAttribute("src", "dist/images/heart.png");
      reactionsHeart.style.width = "22px";
      reactionsHeart.style.height = "22px";
    });
    reactionsHeart.addEventListener("click", () => {
      eventBus.emit("clickedLikeComment", +reactionsHeart.dataset.id);
    });
  }

  return appendChildren(
    buildComponent("div", { id: `comment-${comment.id}` }, ["comment"]),
    [
      appendChildren(buildComponent("div", {}, ["comment-content"]), [
        appendChildren(buildComponent("div", {}, ["comment-author"]), [
          appendChildren(
            buildComponent("a", { href: `/profile/${author.userId}` }, []),
            [
              buildComponent(
                "img",
                { src: `${staticUrl}/user-avatars/${author.avatar}` },
                ["comment-author__user-avatar-img"],
              ),
            ],
          ),
          appendChildren(buildComponent("div", {}, ["comment-author-info"]), [
            appendChildren(
              buildComponent("a", { href: `/profile/${author.userId}` }, [
                "comment-author__name-href",
              ]),
              [
                buildComponent(
                  "span",
                  {},
                  ["comment-author__name-span"],
                  `${author.firstName} ${author.lastName}`,
                ),
              ],
            ),
            appendChildren(buildComponent("div", {}, ["comment-info"]), [
              commentAuthorTime,
              buildComponent(
                "span",
                { id: `textarea-${comment.id}` },
                ["comment-content__text-span"],
                comment.content,
              ),
            ]),
          ]),
        ]),
        appendChildren(
          buildComponent("div", { id: `comment-menu-${comment.id}` }, [
            "comment-menu",
          ]),
          [
            appendChildren(buildComponent("div", {}, ["comment-reactions"]), [
              appendChildren(buildComponent("button", {}, ["reactions-like"]), [
                reactionsHeart,
              ]),
              buildComponent(
                "span",
                {},
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
