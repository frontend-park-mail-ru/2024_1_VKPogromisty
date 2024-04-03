import BaseModel from "/public/MVC/BaseModel.js";
import {
  AuthService,
  PostService,
  ProfileService,
} from "../../modules/services.js";

class FeedModel extends BaseModel {
  constructor(eventBus, router) {
    super(eventBus);

    this.postService = new PostService();
    this.authService = new AuthService();
    this.profileService = new ProfileService();
    this.router = router;

    this.eventBus.addEventListener(
      "readyRenderPosts",
      this.getPosts.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedPublishButton",
      this.publishPost.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedDeleteButton",
      this.deletePost.bind(this),
    );
    this.eventBus.addEventListener(
      "clickedLogoutButton",
      this.logout.bind(this),
    );
  }

  async getOwnProfileData(path) {
    const resultOwnProfile = await this.profileService.getOwnProfileData();

    resultOwnProfile.body.User["path"] = path;

    switch (resultOwnProfile.status) {
      case 200:
        this.eventBus.emit("receiveOwnProfileData", resultOwnProfile.body.User);
        break;
      case 401:
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
  
  async getPosts(userId, lastPostId) {
    const result = await this.postService.getPosts(userId, lastPostId);

    switch (result.status) {
      case 200:
        this.eventBus.emit("postsGetSuccess", result.body.posts);
        break;
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async publishPost(content, attachments) {
    const result = await this.postService.publishPost(content, attachments);

    switch (result.status) {
      case 200:
        this.eventBus.emit("postPublishedSuccess", result.body.posts);
        break;
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  async deletePost(post_id) {
    const result = await this.postService.publishPost(post_id);

    switch (result.status) {
      case 200:
        this.eventBus.emit("deletePostSuccess", result.body.posts);
        break;
      case 401:
        this.eventBus.emit("logoutSuccess", "/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
  /**
   * Logouts from account
   * @return {void}
   */
  async logout() {
    const result = await this.authService.logout();

    switch (result.status) {
      case 200:
      case 401:
        this.router.redirect("/login");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}
export default FeedModel;
