const sidebar = [
    {
        href: "/feed",
        text: "Новости",
    },
    {
        href: "/messenger",
        text: "Мессенджер",
    },
    {
        href: "/friends",
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
    #userId;

    constructor(parent) {
        this.#parent = parent;
        this.#userId = localStorage.getItem('userId');
    }

    renderSidebar() {
        const template = Handlebars.templates["sidebar.hbs"];
        const userId = this.#userId;

        const fullSidebar = sidebar.concat(
            {
                href: `/profile/${userId}`,
                text: "Профиль",
            },
        );

        this.#parent.innerHTML = template({ fullSidebar });
    }

}