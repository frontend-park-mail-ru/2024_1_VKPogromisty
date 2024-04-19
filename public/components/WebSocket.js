import CSRFProtection from "./CSRFProtection.js";

/**
 * A working WebSocket for all events
 * @class WSocket
 * @property {WebSocket} ws - The WebSocket
 * @method sendMessage - Sends message to current companion
 * @method updateMessage - Updates messages in chat with current companion
 * @method deleteMessage - Deletes message from conversation with current companion
 * @method addEventOnMessage - Adds event on receiving message
 * @method addEventOnError - Adds event on receiving error
 * @method addEventOnClose - Adds event on closing
 */
class WSocket {
  /**
   * Creates an object of class WSocket
   *
   * @param {string} url - The URL to connect with
   */
  constructor(url) {
    this.url = url;
    this.messageEvents = {};
    this.errorsEvents = {};
    this.closingEvents = {};
  }

  /**
   * Opens WebSocket
   */
  openWebSocket() {
    if (
      !this.ws ||
      (this.ws.readyState !== WebSocket.OPEN &&
        this.ws.readyState !== WebSocket.CONNECTING)
    ) {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
      };
      this.ws.onclose = (event) => {
        if (event.code !== 1000) {
          this.intervalId = setInterval(() => {
            this.openWebSocket();
          }, 5000);
        }
      };
    }
  }

  /**
   * Closes WebSocket
   */
  closeWebSocket() {
    if (
      this.ws &&
      this.ws.readyState !== WebSocket.CLOSED &&
      this.ws.readyState !== WebSocket.CLOSING
    ) {
      this.ws.close(1000);
    }
  }

  /**
   * Sends message to current companion
   *
   * @param {number} companionId - The ID of current companion
   * @param {string} textContent - The text content of message
   */
  sendMessage(companionId, textContent) {
    CSRFProtection.addCSRFTokenWebSocket(this.ws, {
      type: "SEND_MESSAGE",
      receiver: +companionId,
      payload: { content: textContent },
    });
  }

  /**
   * Updates messages in chat with current companion
   *
   * @param {number} messageId - The ID of current message
   * @param {string} textContent - The text content of message
   * @param {number} receiverId - The ID of current receiver
   */
  updateMessage(messageId, textContent, receiverId) {
    CSRFProtection.addCSRFTokenWebSocket(this.ws, {
      type: "UPDATE_MESSAGE",
      receiver: +receiverId,
      payload: {
        messageId: +messageId,
        content: textContent,
      },
    });
  }

  /**
   * Deletes message from conversation with current companion
   *
   * @param {number} messageId - The ID of current message
   * @param {number} receiverId - The ID of current receiver
   */
  deleteMessage(messageId, receiverId) {
    CSRFProtection.addCSRFTokenWebSocket(this.ws, {
      type: "DELETE_MESSAGE",
      receiver: +receiverId,
      payload: { messageId: +messageId },
    });
  }

  /**
   * Adds event on receiving message
   *
   * @param {string} eventName - The name of event
   * @param {Function} func - The event to emit on receiving message
   */
  addEventOnMessage(eventName, func) {
    if (this.messageEvents[eventName]) {
      return;
    }

    this.messageEvents[eventName] = true;
    this.ws.addEventListener("message", (event) => func(event));
  }

  /**
   * Adds event on receiving error
   *
   * @param {string} eventName - The name of event
   * @param {Function} func - The event to emit on receiving error
   */
  addEventOnClose(eventName, func) {
    if (this.closingEvents[eventName]) {
      return;
    }

    this.closingEvents[eventName] = true;
    this.ws.addEventListener("close", (event) => func(event));
  }

  /**
   * Adds event on closing
   *
   * @param {string} eventName - The name of event
   * @param {Function} func - The event to emit on closing
   */
  addEventOnError(eventName, func) {
    if (this.errorsEvents[eventName]) {
      return;
    }

    this.errorsEvents[eventName] = true;
    this.ws.addEventListener("error", (event) => func(event));
  }
}

export default WSocket;
