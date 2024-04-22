import "./confirm/confirm.scss";
/**
 * Shows alert with current text and meaning
 *
 * @param {string} typeAlert - The type of alert (error/success/warning)
 * @param {string} alertText - The text of alert
 * @param {boolean} isPermanent - Need to delete alert after 2 seconds?
 */
export function customAlert(
  typeAlert = "error",
  alertText = "Неизвестная ошибка",
  isPermanent = false,
) {
  const alertDiv = document.createElement("div");

  switch (typeAlert) {
    case "warning":
      alertDiv.classList.add("custom-alert_warning");
      break;
    case "success":
      alertDiv.classList.add("custom-alert_success");
      break;
    default:
      alertDiv.classList.add("custom-alert_error");
  }
  alertDiv.innerHTML = alertText;
  document.body.appendChild(alertDiv);

  if (!isPermanent) {
    setTimeout(() => {
      alertDiv.remove();
    }, 2000);
  }
}

/**
 * Shows confirm with current text and variants
 *
 * @param {Function} reason - The confirm cause
 * @param {string} title - The title of confirm
 * @param {string} brief - The text of confirm
 * @param {string} [ok="Да"] - The text in positive case
 * @param {string} [cancel="Нет"] - The text in negative case
 */
export function customConfirm(reason, title, brief, ok = "Да", cancel = "Нет") {
  const template = require("./confirm/confirm.hbs");
  const main = document.getElementById("main");

  const confirmWindow = document.createElement("div");
  confirmWindow.classList.add("confirm-window");
  confirmWindow.style.top = window.scrollY + 200 + "px";

  confirmWindow.innerHTML = template({ title, brief, ok, cancel });
  document.body.appendChild(confirmWindow);
  main.classList.add("blured");

  document.getElementById("confirm-button-ok").addEventListener("click", () => {
    confirmWindow.remove();
    main.classList.remove("blured");
    reason();
  });

  document
    .getElementById("confirm-button-cancel")
    .addEventListener("click", () => {
      confirmWindow.remove();
      main.classList.remove("blured");
    });
}
