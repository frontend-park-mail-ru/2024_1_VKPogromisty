import "./landing.scss";

export function renderLanding() {
  const template = require("./landing.hbs");

  document.body.innerHTML = template({});
}
