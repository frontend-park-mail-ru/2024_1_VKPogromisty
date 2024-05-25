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
    : `/profile/${author.userId}`;
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

  const postImageContent = buildComponent(
    "div",
    { id: `post-image-content-${post.postId}` },
    ["post-image-content"],
  );
  const postFileContent = buildComponent(
    "div",
    { id: `post-file-content-${post.postId}` },
    ["post-file-content"],
  );

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
      postImageContent,
      postFileContent,
    ],
  );

  post.attachments?.forEach((elem) => {
    if (imageTypes.includes(typeFile(elem))) {
      appendChildren(postImageContent, [
        appendChildren(
          buildComponent(
            "div",
            { id: `post-image-block-${post.postId}`, "data-filename": elem },
            ["post-image-block"],
          ),
          [
            buildComponent(
              "img",
              { src: `${staticUrl}/post-attachments/${elem}` },
              ["post-content__img"],
            ),
          ],
        ),
      ]);
    } else {
      appendChildren(postFileContent, [
        appendChildren(
          buildComponent(
            "div",
            { id: `post-file-block-${post.postId}`, "data-filename": elem },
            ["post-file-block"],
          ),
          [
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
                  buildComponent(
                    "span",
                    {},
                    ["news-file-content__name-span"],
                    elem,
                  ),
                  buildComponent("img", { src: "dist/images/document.png" }, [
                    "news-file-content__img",
                  ]),
                ],
              ),
            ]),
          ],
        ),
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
    const deletedFiles = [];
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
      if (
        textarea.value.trim() === "" &&
        document.querySelectorAll(".post-image-block").length === 0 &&
        document.querySelectorAll(".post-file-block").length === 0
      ) {
        cancel.click();
        return;
      }

      eventBus.emit("clickedUpdatePost", {
        content: textarea.value,
        attachmentsToDelete: deletedFiles,
        postId: id,
      });
    });

    const cancel = document.createElement("img");
    cancel.classList.add("post-author__cancel-img");
    cancel.setAttribute("data-id", id);
    cancel.setAttribute("src", "dist/images/cancel.png");
    cancel.addEventListener("click", () => {
      document
        .querySelectorAll(".post-image-content .news-img-content__cancel-img")
        .forEach((cancelElem) => {
          cancelElem?.remove();
        });
      eventBus.emit("canceledUpdatePost", {
        postId: id,
        isCanceled: true,
      });
    });

    parent.appendChild(ok);
    parent.appendChild(cancel);
    editImg.style["display"] = "none";
    nextElem.style["display"] = "none";

    document
      .querySelectorAll(`#post-content-${post.postId} .post-image-block`)
      .forEach((block) => {
        const deleteFileImg = buildComponent(
          "img",
          { src: "dist/images/cancel.png" },
          [`news-img-content__cancel-img`],
        );

        appendChildren(block, [deleteFileImg]);

        deleteFileImg.addEventListener("click", () => {
          deletedFiles.push(block.dataset.filename);
          block?.remove();
        });
      });

    document
      .querySelectorAll(`#post-content-${post.postId} .post-file-block`)
      .forEach((block) => {
        const deleteFileImg = buildComponent(
          "img",
          { src: "dist/images/cancel.png" },
          [`news-file-content__cancel-img`],
        );

        appendChildren(block, [deleteFileImg]);

        deleteFileImg.addEventListener("click", () => {
          deletedFiles.push(block.dataset.filename);
          block?.remove();
        });
      });
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
        id: `post-create-comment`,
        type: "text",
        placeholder: "Оставить комментарий",
      },
      ["post-footer__input"],
    );

    commentInput.addEventListener("keydown", (event) => {
      if (event.code === "Enter" && commentInput.value.trim() !== "") {
        eventBus.emit("postCommentAdded", {
          postId: post.postId,
          content: commentInput.value,
        });
        commentInput.value = "";
      }
    });

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
          isMe && !isPostPage ? [editImg, trashCan] : null,
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

  const editImg = buildComponent(
    "img",
    {
      src: "dist/images/edit.png",
      "data-id": comment.id,
      id: `edit-img-${comment.id}`,
    },
    ["comment-author__edit-img"],
  );

  const trashCanImg = buildComponent(
    "img",
    {
      src: "dist/images/trash-can.png",
      "data-id": comment.id,
      id: `trash-basket-${comment.id}`,
    },
    ["comment-author__trash-basket-img"],
  );

  const textareaComment = buildComponent(
    "textarea",
    { id: `comment-textarea-${comment.id}`, readonly: true },
    ["comment-content__text-span"],
    comment.content,
  );

  editImg.addEventListener("click", () => {
    const parent = editImg.parentNode;
    const id = editImg.dataset.id;

    modifyComponent(textareaComment, { readonly: null });
    textareaComment.focus();

    const ok = document.createElement("img");
    ok.classList.add("comment-author__accept-img");
    ok.setAttribute("data-id", id);
    ok.setAttribute("src", "dist/images/check.png");
    ok.addEventListener("click", () => {
      if (textareaComment.value.trim() === "") {
        cancel.click();
        return;
      }

      eventBus.emit("clickedUpdateComment", {
        content: textareaComment.value,
        commentId: comment.id,
      });
    });

    const cancel = document.createElement("img");
    cancel.classList.add("comment-author__cancel-img");
    cancel.setAttribute("data-id", id);
    cancel.setAttribute("src", "dist/images/cancel.png");
    cancel.addEventListener("click", () => {
      textareaComment.value = comment.content;

      ok.remove();
      cancel.remove();
      editImg.style.display = "block";
      trashCanImg.style.display = "block";
    });

    appendChildren(parent, [cancel, ok]);

    editImg.style["display"] = "none";
    trashCanImg.style["display"] = "none";
  });

  if (isMe) {
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
              buildComponent("div", {}, ["comment-author-info-header"]),
              [
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
                commentAuthorTime,
              ],
            ),
            appendChildren(buildComponent("div", {}, ["comment-info"]), [
              textareaComment,
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
            appendChildren(
              buildComponent("div", { id: `comment-redact-${comment.id}` }, [
                "comment-redact",
              ]),
              [trashCanImg, editImg],
            ),
          ],
        ),
      ]),
    ],
  );
}

/**
 * Makes sticker
 *
 * @param {*} param0
 * @returns
 */
export function makeSticker({ name, fileName, id, staticUrl, eventBus, isMe }) {
  const deleteBlock = appendChildren(
    buildComponent("div", { "data-id": id }, ["sticker__delete-block"]),
    [
      buildComponent("img", { src: "dist/images/remove.png" }, [
        "sticker__delete-img",
      ]),
    ],
  );

  deleteBlock.addEventListener("click", () => {
    customConfirm(
      () => {
        eventBus.emit("clickedDeleteSticker", id);
      },
      "Удалить стикер?",
      "Вы уверены, что хотите удалить стикер?",
      "Удалить",
      "Отмена",
    );
  });

  const stickerItem = appendChildren(
    buildComponent("div", {}, ["sticker__item"]),
    [
      buildComponent("img", { src: `${staticUrl}/stickers/${fileName}` }, [
        "sticker__img",
      ]),
    ],
  );

  if (isMe) {
    appendChildren(stickerItem, [deleteBlock]);
  }

  return appendChildren(
    buildComponent("div", { id: `sticker-${id}` }, ["sticker-block"]),
    [
      buildComponent("acronym", { title: name }, ["sticker__name"], name),
      stickerItem,
    ],
  );
}

/**
 * Makes a small sticker
 *
 * @param {*} param0
 * @returns
 */
export function makeSmallSticker({
  companionId,
  id,
  staticUrl,
  fileName,
  eventBus,
}) {
  const smallSticker = buildComponent("div", { id: `sticker-${id}` }, [
    "sticker__item_small",
  ]);

  smallSticker.addEventListener("click", () => {
    eventBus.emit("clickedSendSticker", { companionId, stickerId: id });
    document
      .getElementById("sticker-message-place")
      .classList.add("sticker-message-place_invisible");
  });

  return appendChildren(smallSticker, [
    buildComponent("img", { src: `${staticUrl}/stickers/${fileName}` }, [
      "sticker__img",
    ]),
  ]);
}

/**
 * Makes a message
 *
 * @param {*} param0
 * @param {*} staticUrl
 * @param {*} companionId
 * @param {*} eventBus
 * @returns
 */
export function makeMessage(
  {
    isMe,
    attachments,
    fullCreatedAt,
    createdAt,
    id,
    content,
    isUpdated,
    sticker,
  },
  staticUrl,
  companionId,
  eventBus,
) {
  const sideMessage = isMe ? "right" : "left";
  const deletedFiles = [];
  const messageContent = buildComponent("div", {}, ["message-content-div"]);

  let firstIndexAppleEmoji = content.search(/<img src=".*\/appleEmoji\//g);

  while (firstIndexAppleEmoji !== -1) {
    content =
      content.slice(0, firstIndexAppleEmoji + 5) +
      `class="sticker-message-place-content__emoji-img" alt="emoji" ` +
      content.slice(firstIndexAppleEmoji + 5);
    firstIndexAppleEmoji = content.search(/<img src=".*\/appleEmoji\//g);
  }

  const textMessage = appendChildren(
    buildComponent("div", { id: `message-${id}` }, [
      "message",
      `${sideMessage}-message`,
    ]),
    [
      !sticker
        ? appendChildren(messageContent, [
            buildComponent(
              "div",
              { id: `message-content-${id}` },
              ["message-content"],
              content,
            ),
          ])
        : appendChildren(buildComponent("div", {}, ["sticker_item"]), [
            buildComponent(
              "img",
              { src: `${staticUrl}/stickers/${sticker?.fileName}` },
              ["sticker__img"],
            ),
          ]),
      appendChildren(
        buildComponent("div", { id: `message-time-edited-${id}` }, [
          "message-time-edited",
        ]),
        isUpdated
          ? [
              buildComponent(
                "span",
                {},
                ["message-time-edited__span-time"],
                createdAt,
              ),
              buildComponent(
                "span",
                { id: `message-edited-${id}` },
                ["message-time-edited__span-edited"],
                ".ред",
              ),
            ]
          : [
              buildComponent(
                "span",
                {},
                ["message-time-edited__span-time"],
                createdAt,
              ),
            ],
      ),
    ],
  );

  attachments?.forEach((attachment) => {
    if (imageTypes.includes(typeFile(attachment))) {
      appendChildren(messageContent, [
        appendChildren(buildComponent("div", {}, ["message-image-content"]), [
          buildComponent(
            "img",
            { src: `${staticUrl}/message-attachments/${attachment}` },
            ["message-attachment__img"],
          ),
        ]),
      ]);
    } else {
      appendChildren(messageContent, [
        appendChildren(buildComponent("div", {}, ["message-file-content"]), [
          appendChildren(
            buildComponent(
              "a",
              {
                target: "_blank",
                rel: "noopener",
                href: `${staticUrl}/message-attachments/${attachment}`,
                download: attachment,
              },
              ["message-file-content__a"],
            ),
            [
              buildComponent(
                "span",
                {},
                ["message-file-content__name-span"],
                attachment,
              ),
              buildComponent("img", { src: "dist/images/document.png" }, [
                "message-file-content__img",
              ]),
            ],
          ),
        ]),
      ]);
    }
  });

  const editAble = buildComponent(
    "img",
    { id: `edit-img-${id}`, "data-id": id, src: "dist/images/edit.png" },
    ["message__edit-img"],
  );
  const trashCan = buildComponent(
    "img",
    {
      id: `trash-basket-${id}`,
      "data-id": id,
      src: "dist/images/trash-can.png",
    },
    ["message__trash-basket-img"],
  );

  editAble.addEventListener("click", () => {
    const inputMessage = document.getElementById("print-message__text-input");
    const sendMessage = document.getElementById("message-menu__send-button");
    const messageId = editAble.dataset.id;
    const messageContent = document.getElementById(
      `message-content-${messageId}`,
    );
    const okMessage = document.createElement("img");
    const parentSend = sendMessage.parentElement;

    Array.from(
      document.getElementsByClassName("message-menu__accept-img"),
    ).forEach((elem) => {
      elem.remove();
    });

    okMessage.setAttribute("src", "dist/images/check.png");
    okMessage.setAttribute("data-id", messageId);
    okMessage.classList.add("message-menu__accept-img");

    okMessage.addEventListener("click", () => {
      if (
        inputMessage.value !== messageContent.innerHTML &&
        inputMessage.value.trim() !== ""
      ) {
        this.eventBus.emit("clickedUpdateMessage", {
          messageId: messageId,
          textContent: inputMessage.value,
          receiver: this.companionId,
        });
        inputMessage.focus();
      }

      sendMessage.style.display = "block";
      okMessage.remove();

      inputMessage.onkeydown = (event) => {
        if (event.key === "Enter") {
          sendMessage.click();
        }
      };

      inputMessage.value = "";
    });

    inputMessage.onkeydown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        okMessage.click();
      }
    };

    inputMessage.value = messageContent.innerHTML;
    sendMessage.style.display = "none";
    parentSend.insertBefore(okMessage, sendMessage);

    document
      .querySelectorAll(`#message-content-${id} .message-image-content`)
      .forEach((block) => {
        const deleteFileImg = buildComponent(
          "img",
          { src: "dist/images/cancel.png" },
          [`news-img-content__cancel-img`],
        );

        appendChildren(block, [deleteFileImg]);

        deleteFileImg.addEventListener("click", () => {
          deletedFiles.push(block.dataset.filename);
          block?.remove();
        });
      });
  });

  trashCan.addEventListener("click", () => {
    customConfirm(
      () => {
        eventBus.emit("clickedDeleteMessage", {
          messageId: id,
          receiver: companionId,
        });
      },
      "Удалить сообщение?",
      "Вы уверены, что хотите удалить сообщение?",
      "Удалить",
      "Отмена",
    );
  });
  const ables = buildComponent("div", {}, ["ables"]);
  sticker
    ? appendChildren(ables, [trashCan])
    : appendChildren(ables, [editAble, trashCan]);

  let stickerMessage;
  if (sticker) {
    stickerMessage = appendChildren(
      buildComponent("div", { id: `message-${id}` }, [
        "sticker-message",
        `${sideMessage}-message`,
      ]),
      [
        appendChildren(buildComponent("div", {}, ["sticker__item"]), [
          buildComponent(
            "img",
            { src: `${staticUrl}/stickers/${sticker?.fileName}` },
            ["sticker__img"],
          ),
        ]),
        appendChildren(
          buildComponent("div", { id: `message-time-edited-${id}` }, [
            "message-time-edited",
          ]),
          isUpdated
            ? [
                buildComponent(
                  "span",
                  {},
                  ["message-time-edited__span-time"],
                  createdAt,
                ),
                buildComponent(
                  "span",
                  { id: `message-edited-${id}` },
                  ["message-time-edited__span-edited"],
                  "ред.",
                ),
              ]
            : [
                buildComponent(
                  "span",
                  {},
                  ["message-time-edited__span-time"],
                  createdAt,
                ),
              ],
        ),
      ],
    );
  }

  if (isMe) {
    return appendChildren(
      buildComponent("div", { "data-timeCreated": fullCreatedAt }, [
        "message-ables",
      ]),
      [sticker ? stickerMessage : textMessage, ables],
    );
  }

  return appendChildren(
    buildComponent("div", { "data-timeCreated": fullCreatedAt }, [
      "message-ables",
    ]),
    [sticker ? stickerMessage : textMessage],
  );
}
