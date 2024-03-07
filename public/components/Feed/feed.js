import { API_URL } from "/public/modules/consts.js";
import { AuthService } from "/public/modules/services.js";

const staticUrl = `${API_URL}/static`;
const fullUserName = `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`;
const userAvatar = `${staticUrl}/${localStorage.getItem("avatar")}`;

const authService = new AuthService();

const sidebar = [
  {
    href: "#",
    text: "Профиль",
  },
  {
    href: "#",
    text: "Новости",
  },
  {
    href: "#",
    text: "Мессенджер",
  },
  {
    href: "#",
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

const right_sidebar = [
  {
    href: "#",
    text: "Друзья",
  },
  {
    href: "#",
    text: "Фотографии",
  },
  {
    href: "#",
    text: "Рекомендации",
  },
];

export class FeedMain {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  renderForm() {
    const template = Handlebars.templates["feedMain.hbs"];
    this.#parent.innerHTML = template({ sidebar, right_sidebar });
  }
}

export class FeedHeader {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  renderForm() {
    const template = Handlebars.templates["feedHeader.hbs"];
    this.#parent.innerHTML = template({userAvatar, fullUserName});

    document.getElementById("logout-button").addEventListener("click", async () => {
      if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
        await authService.logout();
        window.location.replace("/login");
      }
    });
  }
}

export class FeedPost {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  renderPosts(posts) {
    const template = Handlebars.templates["post.hbs"];
    this.#parent.innerHTML += template({ posts, userAvatar, fullUserName, staticUrl });
  }
}
