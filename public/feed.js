import { PostService, AuthService } from "./modules/services.js";
import { FeedHeader, FeedMain, FeedPost } from "./components/Feed/feed.js";

const authService = new AuthService();

const result = await authService.isAuthorized();

if (!result.body) {
  window.location.replace("/login");
}

const postService = new PostService();

const feedHeader = new FeedHeader(document.getElementById("header"));
const feedMain = new FeedMain(document.getElementById("main"));

feedHeader.renderForm();
feedMain.renderForm();

const post = new FeedPost(document.getElementById("activity"));
const posts = await postService.getPosts();

post.renderPosts(posts.body);
