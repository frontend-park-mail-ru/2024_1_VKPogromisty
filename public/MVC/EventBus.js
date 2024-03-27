/**
 * EventBus - класс управления event и обработчиков.
 */
class EventBus {
  /**
   * Конструктор класса EventBus.
   *
   * @param {strings[]} incomingEvents - Массив приходящих допустимых событий.
   */
  constructor(incomingEvents) {
    this.incomingEvents = incomingEvents;
    this.handlers = {};
  }
  /**
   * Добавляет обработчик конкретному событию.
   *
   * @param {string} event - Название события.
   * @param {function} handler - Название обработчика.
   *
   */
  addEventListener(event, handler) {
    if (!this.incomingEvents.includes(event)) {
      throw new Error("Event is not allowed");
    }

    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }

    this.handlers[event].push(handler);
  }
  /**
   * Отправляет события с данными.
   *
   * @param {string} event - Название события.
   * @param {*} data - Передаваемые обработчику данные.
   *
   */
  emit(event, data) {
    if (!this.incomingEvents.includes(event)) {
      throw new Error("Event is not allowed");
    }

    if (!this.handlers[event]) {
      return;
    }

    this.handlers[event].forEach((handler) => {
      handler(data);
    });
  }
}

export default EventBus;
