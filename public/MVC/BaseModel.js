

/**
 * BaseModel - класс для обработки данных, общения с бэком.
 */
class BaseModel {
  /**
   * Конструктор класса BaseModel.
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
  }
}

export default BaseModel;
