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
      alertDiv.classList.add("custom-alert", "custom-alert-warning");
      break;
    case "success":
      alertDiv.classList.add("custom-alert", "custom-alert-success");
      break;
    default:
      alertDiv.classList.add("custom-alert", "custom-alert-error");
  }
  alertDiv.innerHTML = alertText;
  document.body.appendChild(alertDiv);

  if (!isPermanent) {
    setTimeout(() => {
      alertDiv.remove();
    }, 2000);
  }
}
