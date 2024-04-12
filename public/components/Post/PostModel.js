import BaseModel from "../../MVC/BaseModel.js";
import { PostService, ProfileService } from "../../modules/services.js";

/**
 * FriendsModel - класс для обработки данных, общения с бэком.
 */
class PostModel extends BaseModel {
  /**
   * Конструктор класса PostModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {UserState} userState - Текущее состояние юзера
   */
  constructor(eventBus, router, userState) {
    super(eventBus);

    this.profileService = new ProfileService();
    this.postService = new PostService();

    this.userState = userState;
    this.router = router;

    this.eventBus.addEventListener(
      "clickedUpdatePost",
      this.updatePost.bind(this),
    );
    this.eventBus.addEventListener(
      "canceledUpdatePost",
      this.getCurrentPost.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedDeleteButton",
      this.deletePost.bind(this),
    );
  }

  async getCurrentPost(postId) {
    const result = await this.postService.getCurrentPost(
      postId,
      this.userState,
    );

    switch (result.status) {
      case 200:
        this.eventBus.emit("postCanceledSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async updatePost({ postId, content }) {
    const result = await this.postService.updatePost(
      postId,
      content,
      this.userState,
    );

    switch (result.status) {
      case 200:
        this.eventBus.emit("postUpdateSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async deletePost(postId) {
    const result = await this.postService.deletePost(postId, this.userState);

    switch (result.status) {
      case 204:
        this.eventBus.emit("postDeleteSuccess", postId);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default PostModel;
