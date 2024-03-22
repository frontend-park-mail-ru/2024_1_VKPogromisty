const sidebar = [
    {
        href: "/feed",
        text: "Новости",
    },
    {
        href: "/profile",
        text: "Профиль",
    },
    {
        href: "/messenger",
        text: "Мессенджер",
    },
    {
        href: "friends",
        text: "Друзья",
    },
    {
        href: "#",
        text: "Сообщества",
    },
    {
        href: "#",
        text: "Настройки",
    },
    {
        href: "#",
        text: "Стикеры",
    },
];

export class Sidebar {
    #parent;

    constructor(parent) {
        this.#parent = parent;
    }

    renderSidebar() {
        const template = Handlebars.templates["sidebar.hbs"];

        this.#parent.innerHTML = template({ sidebar });
    }

}