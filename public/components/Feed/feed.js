const sidebar = [
    {
        href: '#',
        text: 'Профиль',
    },
    {
        href: '#',
        text: 'Новости',
    },
    {
        href: '#',
        text: 'Мессенджер',
    },
    {
        href: '#',
        text: 'Друзья',
    },
    {
        href: '#',
        text: 'Сообщества',
    },
    {
        href: '#',
        text: 'Настройки',
    },
    {
        href: '#',
        text: 'Стикеры',
    },
]

const right_sidebar = [
    {
        href: '#',
        text: 'Друзья',
    },
    {
        href: '#',
        text: 'Фотографии',
    },
    {
        href: '#',
        text: 'Рекомендации',
    },
]

export class FeedMain {

    #parent

    constructor(parent) {
        this.#parent = parent;
    }

    renderForm() {
        const template = Handlebars.templates['feedMain.hbs'];
        this.#parent.innerHTML = template({sidebar, right_sidebar});
    }

}

export class FeedHeader {
    
    #parent

    constructor(parent) {
        this.#parent = parent;
    }

    renderForm() {
        const template = Handlebars.templates['feedHeader.hbs'];
        this.#parent.innerHTML = template({});
    }

}

export class FeedPost {

    #parent

    constructor(parent) {
        this.#parent = parent;
    }

    renderPosts(posts) {
        const template = Handlebars.templates['post.hbs'];
        this.#parent.innerHTML = template({posts});
    }

}
