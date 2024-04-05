
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
        this.ws = new WebSocket(url);
    }

    /**
     * Sends message to current companion
     * 
     * @param {number} companionId - The ID of current companion
     * @param {string} textContent - The text content of message
     */
    sendMessage(companionId, textContent) {
        this.ws.send(JSON.stringify({type: "SEND_MESSAGE", receiver: +companionId, payload: { content: textContent }}));
    }

    /**
     * Updates messages in chat with current companion
     * 
     * @param {number} messageId - The ID of current message
     * @param {string} textContent - The text content of message
     */
    updateMessage(messageId, textContent) {
        this.ws.send(
            JSON.stringify({
              type: "UPDATE_MESSAGE",
              payload: { messageId: +messageId, content: textContent },
            }),
          );
    }

    /**
     * Deletes message from conversation with current companion
     * 
     * @param {number} messageId - The ID of current message
     */
    deleteMessage(messageId) {
        this.ws.send(
            JSON.stringify({
              type: "DELETE_MESSAGE",
              payload: { messageId: +messageId },
            }),
          );
    }

    /**
     * Adds event on receiving message
     * 
     * @param {Function} func - The event to emit on receiving message
     */
    addEventOnMessage(func) {
        this.ws.addEventListener("message", (event) => func(event));
    }

    /**
     * Adds event on receiving error
     * 
     * @param {Function} func - The event to emit on receiving error
     */
    addEventOnClose(func) {
        this.ws.addEventListener('close', (event) => func(event));
    }

    /**
     * Adds event on closing
     * 
     * @param {Function} func - The event to emit on closing
     */
    addEventOnError(func) {
        this.ws.addEventListener('error', (event) => func(event));
    }
}

export default WSocket;