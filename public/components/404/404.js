import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import UserState from "../UserState.js";
import "./404.scss";

export function renderNotFound() {
  const { userId, avatar, firstName, lastName } = UserState;
  const template = require("./404.hbs");

  new Header(document.body).renderForm({
    userId,
    avatar,
    firstName,
    lastName,
  });
  new Main(document.body).renderForm(userId);

  const mainElement = document.getElementById("activity");
  mainElement.innerHTML = template({});
}
