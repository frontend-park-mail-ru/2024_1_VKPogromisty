import {AuthService, PostService} from "./modules/services.js";
    
const authService = new AuthService();
const postService = new PostService();

const pageHeader = document.getElementById('header');
const pageMain = document.getElementById('main');
const pageLeftSide = document.getElementById('left-side');
const pageRightSide = document.getElementById('right-side');

const config = {
    feed: {
        url: "/feed",
        render: renderFeed
    },
    authorization: {
        url: '/login',
        render: renderLogin
    },
    registration: {
        url: '/sign_up',
        render: renderSignUp
    }
}

function createInput(type, text, name) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = text;
  
    return input;
  }

function renderFeed() {
}
    
function renderLogin() {
}

function renderSignUp() {

}

function goToPage(target) {
}

const result = await authService.isAuthorized();

if (!result) {
    goToPage("authorization");
} else {
    goToPage("feed");
}

document.getElementById('login-btn').addEventListener('click', async () => {
    const result = await authService.login("petr09mitin@mail.ru", "admin");
    console.log(result)
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    await authService.logout("petr09mitin@mail.ru", "admin");
});

document.getElementById('posts-btn').addEventListener('click', async () => {
    const result = await postService.getPosts();
    console.log(result)
});

