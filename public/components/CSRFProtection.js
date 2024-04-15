import { API_URL } from "../modules/consts.js";

class CSRFProtection {
  /**
   * Updates CSRF token from the server
   *
   * @returns {boolean}
   */
  async updateCSRFToken() {
    const response = await fetch(`${API_URL}/csrf/`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (response.status === 401) {
      return false;
    }

    this.csrfToken = data.body.csrfToken;
    return true;
  }

  /**
   * Adds CSRF token to common requests
   *
   * @param {string} url
   * @param {Object} state
   * @returns
   */
  async addCSRFToken(url, state) {
    if (!state.headers) {
      state.headers = { "X-CSRF-Token": this.csrfToken };
    } else {
      state.headers["X-CSRF-Token"] = this.csrfToken;
    }

    const result = await fetch(url, state);

    if (result.status === 403) {
      await this.updateCSRFToken();
      state.headers["X-CSRF-Token"] = this.csrfToken;
    } else {
      return result;
    }

    return fetch(url, state);
  }

  /**
   * Adds CSRF token to web socket's messages
   *
   * @param {WebSocket} webSocket
   * @param {Object} state
   */
  async addCSRFTokenWebSocket(webSocket, state) {
    state.csrfToken = this.csrfToken;
    webSocket.send(JSON.stringify(state));
  }
}

export default new CSRFProtection();
