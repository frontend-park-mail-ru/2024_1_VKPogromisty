/**
 * BaseView - класс для работы с визуалом на странице.
 */
class BaseView {
  /**
   * Конструктор класса BaseView .
   *
   * @param {EventBus} eventBus - Объект класса EventBus.
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Рендер внутри переданного HTML элемента.
   * Переопределение в наследниках.
   *
   * @param {HTMLElement} element- HTML элемен, в который будет рендериться.
   * @return {void}
   */
  render(element) {}
}

export default BaseView;
