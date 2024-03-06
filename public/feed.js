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
const create_post = document.getElementById('create-post');

function multiAppend(el, ...args) {
    args.forEach((arg) => {
        el.appendChild(arg);
    });
}

for (let i of posts.body) {
    const post = bse.createDiv(`post${i.post.postId}`, '', 'post');
    activity.insertBefore(post, create_post.nextElementSibling);

    const post_header = bse.createDiv('', '', 'post-header');
    const post_author = bse.createDiv('', '', 'post-author');
    const post_menu = bse.createDiv('', '', 'post-menu');
    const post_content = bse.createDiv('', '', 'post-content');
    const post_reaction = bse.createDiv('', '', 'post-reaction');
    const post_comment = bse.createDiv('', '', 'post-comment');
    const post_give_comment = bse.createDiv('', '', 'post-give-comment');
    const reactions = bse.createDiv('', '', 'reactions');
    const comment_menu = bse.createDiv('', '', 'comment-menu');
    const comment = bse.createDiv('', '', 'comment');
    const text_comment = bse.createDiv('', '', 'text-comment');
    const post_footer = bse.createDiv('', '', 'post-footer');
    const comment_buttons = bse.createDiv('', '', 'comment-buttons');

    const buttonLike = bse.createButton('', '', 'like');
    const buttonShowComments = bse.createButton('', '', 'show-comments');
    const buttonInclude = bse.createButton('', '', 'include-button');
    const buttonSend = bse.createButton('', '', 'send-button');
    
    const imgPostComment = bse.createImage('', '../static/images/send.png', 'post-comment-img')

    multiAppend(post, post_header, post_content, post_reaction, post_give_comment);

    //post.appendChild(post_comment);

    multiAppend(post_header, post_author, post_menu);
    multiAppend(post_reaction, reactions, comment_menu);

    post_comment.appendChild(comment);

    multiAppend(post_give_comment, post_footer, comment_buttons);
    multiAppend(comment, bse.createImage('', '../static/images/logo.png', 'user-avatar-post'), text_comment)
    multiAppend(post_author, 
                bse.createImage('', `${staticUrl}/${i.author.avatar}`, 'user-avatar-post'),
                bse.createSpan('', i.author.firstName + ' ' + i.author.lastName, 'author-name')
                );

    post_menu.appendChild(bse.createImage('', '../static/images/more.png', 'ellipsees'));

    multiAppend(reactions, buttonLike, buttonShowComments, 
                bse.createSpan('', 'Показать комментарии', 'show-comments-label'));

    buttonLike.appendChild(bse.createImage('', '../static/images/heart.png', 'heart'))
    buttonShowComments.appendChild(bse.createImage('', '../static/images/messenger.png', 'messenger'));

    comment_menu.appendChild(bse.createImage('', '../static/images/more.png', 'ellipsees'));

    text_comment.appendChild(bse.createSpan('', 'Катя Киррилова', 'comment-author'));
    text_comment.appendChild(bse.createSpan('', 'Ребята молодцы, очень достойная Figma!!!', 'comment-text'));

    multiAppend(post_footer,
                bse.createImage('', `${staticUrl}/${localStorage.getItem('avatar')}`, 'user-avatar-post'),
                bse.createInput('text', 'user-comment', 'Оставить комментарий', `user-comment${i.post.postId}`, 'user-comment')
                );
    multiAppend(comment_buttons, buttonInclude, buttonSend);

    buttonInclude.appendChild(bse.createImage('', '../static/images/attach-paperclip-symbol.png', 'paper-clip'));
    buttonSend.appendChild(imgPostComment);
    
    post_content.appendChild(bse.createSpan('', i.post.text, 'content-text'));

    for (let j of i.post.attachments) {
        post_content.appendChild(bse.createImage('', `${staticUrl}/${j}`), 'content-img');
    }
}

