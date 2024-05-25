import BaseView from "../../MVC/BaseView";
import { formatFullDate } from "../../modules/dateRemaking";
import UserState from "../UserState";
import { makeComment } from "../../modules/makeComponents";
import { modifyComponent } from "../createComponent";

class CommentView extends BaseView {
  constructor(eventBus) {
    super(eventBus);

    this.eventBus.addEventListener(
      "commentsGotSuccess",
      this.renderComments.bind(this),
    );
    this.eventBus.addEventListener(
      "commentAddedSuccess",
      this.addComment.bind(this),
    );
    this.eventBus.addEventListener(
      "commentDeletedSuccess",
      this.deleteComment.bind(this),
    );
    this.eventBus.addEventListener(
      "commentLikedSuccess",
      this.likedComment.bind(this),
    );
    this.eventBus.addEventListener(
      "commentUnlikedSuccess",
      this.unlikedComment.bind(this),
    );
    this.eventBus.addEventListener(
      "commentUpdatedSuccess",
      this.updateComment.bind(this),
    );
  }

  /**
   * Renders comments of post on the page
   *
   * @param {*} comments
   */
  renderComments(comments) {
    this.commentsElement = document.getElementById("comments");

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
          makeComment(comment, hasUpdated, isMe, author, this.eventBus),
        );
      });
    } else {
      document
        .getElementById("no-comments")
        .classList.add("no-comments_visible");
    }

    [...document.getElementsByClassName("comment-content__text-span")].forEach(
      (textArea) => {
        textArea.style.height = "auto";
        textArea.style.height =
          (textArea.scrollHeight < 30 ? 30 : textArea.scrollHeight) + "px";
      },
    );
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

    this.commentsElement.appendChild(
      makeComment(comment, hasUpdated, isMe, UserState, this.eventBus),
    );

    const currentTextarea = document.getElementById(
      `comment-textarea-${comment.id}`,
    );
    currentTextarea.style.height = "auto";
    currentTextarea.style.height =
      (currentTextarea.scrollHeight < 30 ? 30 : currentTextarea.scrollHeight) +
      "px";

    document
      .getElementById("no-comments")
      ?.classList.remove("no-comments_visible");
    document.getElementById(`comment-${comment.id}`)?.scrollIntoView();
  }

  /**
   * Deletes the comment
   *
   * @param {number} commentId - The number of comment
   */
  deleteComment(commentId) {
    document.getElementById(`comment-${commentId}`)?.remove();
    if (document.getElementById("comments").childNodes.length == 0) {
      document
        .getElementById("no-comments")
        .classList.add("no-comments_visible");
    }
  }

  /**
   * Updates current comment
   *
   * @param {number} commentId - The ID of comment
   */
  updateComment(commentId) {
    const currentTextArea = document.getElementById(
      `comment-textarea-${commentId}`,
    );

    modifyComponent(currentTextArea, { readonly: true });

    const commentRedact = document.getElementById(
      `comment-redact-${commentId}`,
    );

    commentRedact.removeChild(commentRedact.lastChild);
    commentRedact.removeChild(commentRedact.lastChild);

    commentRedact.firstChild.style.display = "block";
    commentRedact.firstChild.nextSibling.style.display = "block";
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
}

export default CommentView;
