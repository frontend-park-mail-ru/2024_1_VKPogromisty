import BaseView from "../../MVC/BaseView.js";
import { Header } from "../Header/header.js";
import { Main } from "../Main/main.js";
import { API_URL } from "/public/modules/consts.js";
import { formatDayMonthYear } from "../../modules/dateRemaking.js";
import UserState from "../UserState.js";
import "./admin.scss";

/**
 * An object of admin
 * @typedef {Object} Admin
 * @property {number} id - The ID of current admin
 * @property {number} userId - The ID of corresponding user
 * @property {string} createdAt - The date of becoming an admin
 */

/**
 * An object of user
 * @typedef {Object} User
 * @property {string} avatar - The avatar of user
 * @property {string} createdAt - The date of creating accout
 * @property {string} dateOfBirth - The date of birth current user
 * @property {string} email - The email of current user
 * @property {string} firstName - The first name of current user
 * @property {string} lastName - The last name of current user
 * @property {number} userId - The ID of current user
 * @property {string} updatedAt - The last date of updating
 */

/**
 * An object of admin and corresponding user
 * @typedef {Object} AdminUser
 * @property {Admin} admin - An info about admin
 * @property {User} user - An info about user
 */

const staticUrl = `${API_URL}/static`;
const correct = "form__input_correct";

/**
 * AdminView - класс для работы с визуалом на странице.
 */
class AdminView extends BaseView {
  /**
   * Конструктор класса AdminView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {UserState} userState - Текущее состояние юзера
   */
  constructor(eventBus) {
    super(eventBus);

    this.eventBus.addEventListener(
      "getAdminsSuccess",
      this.renderAdmins.bind(this),
    );
    this.eventBus.addEventListener(
      "deletesAdminSuccess",
      this.adminDeleted.bind(this),
    );
    this.eventBus.addEventListener(
      "addsAdminSuccess",
      this.adminAdded.bind(this),
    );
    this.eventBus.addEventListener(
      "gaveIncorrectUserId",
      this.gaveIncorrectUserId.bind(this),
    );
    this.eventBus.addEventListener(
      "serverError",
      this.serverErrored.bind(this),
    );
  }

  /**
   * Renders the main block of page
   */
  renderAdminMain() {
    const { userId, avatar, firstName, lastName } = UserState;

    new Header(document.body).renderForm({
      userId,
      avatar,
      firstName,
      lastName,
    });
    new Main(document.body).renderForm(userId);

    this.mainElem = document.getElementById("activity");

    this.eventBus.emit("needGetAdminsList", {});
  }

  /**
   * Renders list with all admins
   *
   * @param {AdminUser[]} list
   */
  renderAdmins(list) {
    const template = require("./adminMain.hbs");
    const adminTemplate = require("./admin.hbs");

    this.mainElem.innerHTML = template({});
    this.adminElem = document.getElementById("admin-list");

    list.forEach((elem) => {
      const admin = document.createElement("div");

      admin.classList.add("admin");
      admin.setAttribute("id", `admin-${elem.admin.id}`);
      elem.admin.createdAt = formatDayMonthYear(elem.admin.createdAt);
      admin.innerHTML = adminTemplate({ staticUrl, elem });

      this.adminElem.appendChild(admin);
    });

    document.querySelectorAll(".admin__delete-button").forEach((elem) => {
      elem.addEventListener("click", () => {
        this.eventBus.emit("needDeleteAdmin", elem.dataset.id);
      });
    });

    const adminInput = document.getElementById("admin-adding__input");

    document
      .getElementById("admin-adding__button")
      .addEventListener("click", () => {
        document
          .getElementById("incorrect-admin-adding")
          ?.classList.add(correct);
        this.eventBus.emit("needAddAdmin", adminInput.value);
      });
  }

  /**
   * Shows that user's ID is incorrect
   */
  gaveIncorrectUserId() {
    document
      .getElementById("incorrect-admin-adding")
      ?.classList.remove(correct);
  }

  /**
   * Adds admin
   *
   * @param {AdminUser} adminUser
   */
  adminAdded(adminUser) {
    const adminTemplate = require("./admin.hbs");
    const newAdmin = document.createElement("div");

    newAdmin.classList.add("admin");
    newAdmin.setAttribute("id", `admin-${adminUser.admin.id}`);
    newAdmin.innerHTML = adminTemplate({ staticUrl, elem: adminUser });

    this.adminElem.insertBefore(newAdmin, this.adminElem.firstElementChild);

    document.querySelectorAll(".admin__delete-button").forEach((elem) => {
      elem.addEventListener("click", () => {
        this.eventBus.emit("needDeleteAdmin", elem.dataset.id);
      });
    });
  }

  /**
   * Deletes current admin
   *
   * @param {number} adminId
   */
  adminDeleted(adminId) {
    document.getElementById(`admin-${adminId}`)?.remove();
  }

  /**
   * Shows that mistake called
   * @return {void}
   */
  serverErrored() {
    const serverError = document.getElementById("server-error-500");

    serverError.classList.remove("server-error-500");
  }
}

export default AdminView;
