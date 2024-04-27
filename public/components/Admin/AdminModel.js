import BaseModel from "/public/MVC/BaseModel.js";
import { AdminService } from "../../modules/services.js";

/**
 * AdminModel - класс для обработки данных, общения с бэком на странице профиля.
 */
class AdminModel extends BaseModel {
  /**
   * Конструктор класса AdminModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   * @param {Routing} router - Объект класса Routing
   */
  constructor(eventBus, router) {
    super(eventBus);

    this.router = router;
    this.adminService = new AdminService();

    this.eventBus.addEventListener(
      "needGetAdminsList",
      this.getAdminsList.bind(this),
    );
    this.eventBus.addEventListener("needAddAdmin", this.addAdmin.bind(this));
    this.eventBus.addEventListener(
      "needDeleteAdmin",
      this.deleteAdmin.bind(this),
    );
  }

  /**
   * Gets list of admins
   */
  async getAdminsList() {
    const result = await this.adminService.getAdminsList();

    switch (result.status) {
      case 200:
        this.eventBus.emit("getAdminsSuccess", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      case 403:
        this.router.redirect("/feed");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Deletes admin
   *
   * @param {number} adminId - The ID of deleted admin
   */
  async deleteAdmin(adminId) {
    const result = await this.adminService.deleteAdmin(adminId);

    switch (result.status) {
      case 204:
        this.eventBus.emit("deletesAdminSuccess", adminId);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      case 403:
        this.router.redirect("/feed");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }

  /**
   * Creates new admin
   *
   * @param {number} userId - The ID of admined user
   */
  async addAdmin(userId) {
    const result = await this.adminService.addAdmin(userId);

    switch (result.status) {
      case 201:
        this.eventBus.emit("addsAdminSuccess", result.body);
        break;
      case 400:
        this.eventBus.emit("gaveIncorrectUserId", result.body);
        break;
      case 401:
        this.router.redirect("/login");
        break;
      case 403:
        this.router.redirect("/feed");
        break;
      default:
        this.eventBus.emit("serverError", {});
    }
  }
}

export default AdminModel;
