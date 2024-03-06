import { PostService, AuthService } from "./modules/services.js";
import { API_URL } from "./modules/consts.js";

const authService = new AuthService();

const result = await authService.isAuthorized();

if (!result.body) {
    window.location.replace('/login');
}

const postService = new PostService();

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

function createDivPost(className) {
    const post = document.createElement('div');

    post.classList.add(className);

    return post;
}

function createSpan(className, text) {
    const span = document.createElement('span');

    span.classList.add(className);
    span.innerHTML = text;

    return span;
}

function createButton(className) {
    const button = document.createElement('button');

    button.classList.add(className);

    return button;
}

function createImg(className, src) {
    const img = document.createElement('img');

    img.classList.add(className);
    img.setAttribute('src', src);

    return img;
}

function createLowImage(src, width, height) {
    const img = document.createElement('img');

    img.setAttribute('src', src);
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;

    return img;
}

function createInput(type, name, className, placeholder) {
    const input = document.createElement('input');

    input.setAttribute('type', type);
    input.setAttribute('name', name);
    input.setAttribute('class', className);
    input.setAttribute('placeholder', placeholder);

    return input;
}

const posts = await postService.getPosts();
const activity = document.getElementById('activity');
const create_post = document.getElementById('create-post');

for (let i of posts.body) {
    const post = createDivPost('post');
    post.setAttribute('id', `post${i.post.postId}`);
    activity.insertBefore(post, create_post.nextElementSibling);

    const post_header = createDivPost('post-header');
    const post_author = createDivPost('post-author');
    const post_menu = createDivPost('post-menu');
    const post_content = createDivPost('post-content');
    const post_reaction = createDivPost('post-reaction');
    const post_comment = createDivPost('post-comment');
    const post_give_comment = createDivPost('post-give-comment');
    const reactions = createDivPost('reactions');
    const comment_menu = createDivPost('comment-menu');
    const comment = createDivPost('comment');
    const text_comment = createDivPost('text-comment');
    const post_footer = createDivPost('post-footer');
    const comment_buttons = createDivPost('comment-buttons');

    post.appendChild(post_header);
    post.appendChild(post_content);
    post.appendChild(post_reaction);
    //post.appendChild(post_comment);
    post.appendChild(post_give_comment);
    
    post_header.appendChild(post_author);
    post_header.appendChild(post_menu);

    post_reaction.appendChild(reactions);
    post_reaction.appendChild(comment_menu);

    post_comment.appendChild(comment);

    post_give_comment.appendChild(post_footer);
    post_give_comment.appendChild(comment_buttons);

    comment.appendChild(createImg('user-avatar-post', '../static/images/logo.png'));
    comment.appendChild(text_comment);

    post_author.appendChild(createImg('user-avatar-post', `${staticUrl}/${i.author.avatar}`));
    post_author.appendChild(createSpan('author-name', i.author.firstName + ' ' + i.author.lastName));

    post_menu.appendChild(createLowImage('../static/images/more.png', 16, 16));
    const buttonLike = createButton('like');
    const buttonShowComments = createButton('show-comments');
    const buttonInclude = createButton('include-button');
    const buttonSend = createButton('send-button');
    
    reactions.appendChild(buttonLike);
    reactions.appendChild(buttonShowComments);
    reactions.appendChild(createSpan('show-comments-label', 'Показать комментарии'));

    buttonLike.appendChild(createLowImage('../static/images/heart.png', 16, 16))
    buttonShowComments.appendChild(createLowImage('../static/images/messenger.png', 16, 16));

    comment_menu.appendChild(createLowImage('../static/images/more.png', 16, 16));

    text_comment.appendChild(createSpan('comment-author', 'Катя Киррилова'));
    text_comment.appendChild(createSpan('comment-text', 'Ребята молодцы, очень достойная Figma!!!'));

    post_footer.appendChild(createImg('user-avatar-post', `${staticUrl}/${localStorage.getItem('avatar')}`));
    post_footer.appendChild(createInput('text', 'user-comment', 'user-comment', 'Оставить комментарий'));

    comment_buttons.appendChild(buttonInclude);
    comment_buttons.appendChild(buttonSend);

    buttonInclude.appendChild(createLowImage('../static/images/attach-paperclip-symbol.png', 20, 20));

    const imgPostComment = document.createElement('img');
    imgPostComment.classList.add('img');
    imgPostComment.classList.add('post-comment');
    imgPostComment.style.width = "24px";
    imgPostComment.style.height = "24px";
    imgPostComment.setAttribute('src', '../static/images/send.png');

    buttonSend.appendChild(imgPostComment);
    
    post_content.appendChild(createSpan('content-text', i.post.text));

    for (let j of i.post.attachments) {
        post_content.appendChild(createImg('content-img', `${staticUrl}/${j}`));
    }
}

