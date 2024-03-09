import { API_URL } from "/public/modules/consts.js";
import { AuthService } from "/public/modules/services.js";

const staticUrl = `${API_URL}/static`;

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
  #fullUserName;
  #userAvatar;

  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  updateUser() {
    this.#fullUserName = `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`;
    this.#userAvatar = `${staticUrl}/${localStorage.getItem("avatar")}`;
  }

  renderForm() {
    const template = Handlebars.templates["feedHeader.hbs"];
    this.updateUser();

    const userAvatar = this.#userAvatar;
    const fullUserName = this.#fullUserName;
    this.#parent.innerHTML = template({ userAvatar, fullUserName });
  }
}

export class FeedPost {
  #parent;

  #fullUserName;
  #userAvatar;

  constructor(parent) {
    this.#parent = parent;
  }

  updateUser() {
    this.#fullUserName = `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`;
    this.#userAvatar = `${staticUrl}/${localStorage.getItem("avatar")}`;
  }

  renderPosts(posts) {
    const template = Handlebars.templates["post.hbs"];
    this.updateUser();

    const userAvatar = this.#userAvatar;
    const fullUserName = this.#fullUserName;
    this.#parent.innerHTML += template({
      posts,
      userAvatar,
      fullUserName,
      staticUrl,
    });
  }
}
