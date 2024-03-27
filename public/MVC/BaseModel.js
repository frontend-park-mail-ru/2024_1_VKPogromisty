import EventBus from "./EventBus";

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

  /**
   * Добавляет обработчик конкретному событию.
   * Переопределение в наследниках.
   *
   * @return {void}
   */
  getData() {
    //пример функции, которая будет в наследниках
    //const data = { exampleOfGetData: "Go to Backend and return" };
    //
    //this.eventBus.emit("dataGet", data);
  }
}

export default BaseModel;
