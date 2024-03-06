import { PostService, AuthService } from "./modules/services.js";
import { API_URL } from "./modules/consts.js";
import {BaseElements} from './components/baseElements.js';

const authService = new AuthService();

const result = await authService.isAuthorized();

if (!result.body) {
    window.location.replace('/login');
}

const postService = new PostService();
const bse = new BaseElements();

const staticUrl = `${API_URL}/static`;
const fullUserName = `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`;

document.getElementById('user-avatar').setAttribute('src', `${staticUrl}/${localStorage.getItem('avatar')}`);
document.getElementById('username').innerHTML = fullUserName;

document.getElementById('logout-button').addEventListener('click', async () => {
    if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
        await authService.logout();
        window.location.replace('/login');
    }
});

const imgCreatePost = document.createElement('img');
imgCreatePost.setAttribute('id', 'user-avatar-news');
imgCreatePost.setAttribute('src', `${staticUrl}/${localStorage.getItem('avatar')}`);
document.getElementById('news-avatar').appendChild(imgCreatePost);

const posts = await postService.getPosts();
const activity = document.getElementById('activity');
const createPost = document.getElementById('create-post');

function multiAppend(el, ...args) {
    args.forEach((arg) => {
        el.appendChild(arg);
    });
}

for (const post of posts.body) {
    const postMain = bse.createDiv(`post${post.post.postId}`, '', 'post');
    activity.insertBefore(postMain, createPost.nextElementSibling);

    const postHeader = bse.createDiv('', '', 'post-header');
    const postAuthor = bse.createDiv('', '', 'post-author');
    const postMenu = bse.createDiv('', '', 'post-menu');
    const postContent = bse.createDiv('', '', 'post-content');
    const postReaction = bse.createDiv('', '', 'post-reaction');
    const postComment = bse.createDiv('', '', 'post-comment');
    const postGiveComment = bse.createDiv('', '', 'post-give-comment');
    const reactions = bse.createDiv('', '', 'reactions');
    const commentMenu = bse.createDiv('', '', 'comment-menu');
    const comment = bse.createDiv('', '', 'comment');
    const textComment = bse.createDiv('', '', 'text-comment');
    const postFooter = bse.createDiv('', '', 'post-footer');
    const commentButtons = bse.createDiv('', '', 'comment-buttons');

    const buttonLike = bse.createButton('', '', 'like');
    const buttonShowComments = bse.createButton('', '', 'show-comments');
    const buttonInclude = bse.createButton('', '', 'include-button');
    const buttonSend = bse.createButton('', '', 'send-button');
    
    const imgPostComment = bse.createImage('', '../static/images/send.png', 'post-comment-img')

    multiAppend(postMain, postHeader, postContent, postReaction, postGiveComment);

    //post.appendChild(postComment);

    multiAppend(postHeader, postAuthor, postMenu);
    multiAppend(postReaction, reactions, commentMenu);

    postComment.appendChild(comment);

    multiAppend(postGiveComment, postFooter, commentButtons);
    multiAppend(comment, bse.createImage('', '../static/images/logo.png', 'user-avatar-post'), textComment)
    multiAppend(postAuthor, 
                bse.createImage('', `${staticUrl}/${post.author.avatar}`, 'user-avatar-post'),
                bse.createSpan('', post.author.firstName + ' ' + post.author.lastName, 'author-name')
                );

    postMenu.appendChild(bse.createImage('', '../static/images/more.png', 'ellipsees'));

    multiAppend(reactions, buttonLike, buttonShowComments, 
                bse.createSpan('', 'Показать комментарии', 'show-comments-label'));

    buttonLike.appendChild(bse.createImage('', '../static/images/heart.png', 'heart'))
    buttonShowComments.appendChild(bse.createImage('', '../static/images/messenger.png', 'messenger'));

    commentMenu.appendChild(bse.createImage('', '../static/images/more.png', 'ellipsees'));

    textComment.appendChild(bse.createSpan('', 'Катя Киррилова', 'comment-author'));
    textComment.appendChild(bse.createSpan('', 'Ребята молодцы, очень достойная Figma!!!', 'comment-text'));

    multiAppend(postFooter,
                bse.createImage('', `${staticUrl}/${localStorage.getItem('avatar')}`, 'user-avatar-post'),
                bse.createInput('text', 'user-comment', 'Оставить комментарий', `user-comment${post.post.postId}`, 'user-comment')
                );
    multiAppend(commentButtons, buttonInclude, buttonSend);

    buttonInclude.appendChild(bse.createImage('', '../static/images/attach-paperclip-symbol.png', 'paper-clip'));
    buttonSend.appendChild(imgPostComment);
    
    postContent.appendChild(bse.createSpan('', post.post.text, 'content-text'));

    for (const imageURL of post.post.attachments) {
        postContent.appendChild(bse.createImage('', `${staticUrl}/${imageURL}`), 'content-img');
    }
}
