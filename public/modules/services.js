import { API_URL } from "./consts.js";

/**
 * @typedef {Object} APIResponse
 * @property {boolean} ok
 * @property {object} body
 * @property {string} error
 */

/**
 * Turns the response into a standard object
 * @param {boolean} ok 
 * @param {object} body 
 * @param {string} error 
 * @returns {APIResponse} {@link APIResponse}
 */
const genResponse = (ok, body, error) => {
  return {
    ok,
    body,
    error,
  };
};

/**
 * Service for working with the authorization API
 * @class
 * @property {string} baseUrl - The base URL for the server auth service
 * @method {Promise} login - Logs in the user
 * @method {Promise} isAuthorized - Checks if the user is authorized
 * @method {Promise} sign_up - Registers the user
 * @method {Promise} logout - Logs out the user
 */
export class AuthService {
  baseUrl = `${API_URL}/auth/`;

  /**
   * Logs in the user
   * @param {string} email 
   * @param {string} password 
   * @returns {APIResponse} {@link APIResponse}
   */
  async login(email, password) {
    const response = await fetch(this.baseUrl + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.ok, data.body, data.message);
  }

  /**
   * Checks if the user is authorized
   * @returns {APIResponse} {@link APIResponse}
   */
  async isAuthorized() {
    const response = await fetch(this.baseUrl + "is-authorized", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.ok, data.body.isAuthorized, data.message);
  }

  /**
   * Registers the user
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {string} password
   * @param {string} repeatPassword
   * @param {string} dateOfBirth
   * @param {File} avatar
   * @returns {APIResponse} {@link APIResponse}
   */
  async sign_up(
    firstName,
    lastName,
    email,
    password,
    repeatPassword,
    dateOfBirth,
    avatar,
  ) {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("repeatPassword", repeatPassword);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("avatar", avatar);

    const response = await fetch(this.baseUrl + "signup", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.ok, data.body, data.message);
  }

  /**
   * Logs out the user
   * @returns {APIResponse} {@link APIResponse}
   */
  async logout() {
    const response = await fetch(this.baseUrl + "logout", {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      return;
    }

    const data = await response.json();

    return genResponse(response.ok, null, data.message);
  }
}

/**
 * Service for working with the posts API
 * @class
 * @property {string} baseUrl - The base URL for the server posts service
 * @method getPosts - Gets the posts from the server
 */
export class PostService {
  baseUrl = `${API_URL}/posts/`;

  /**
   * Gets the posts from the server
   * @returns {APIResponse} {@link APIResponse}
   */
  async getPosts() {
    const response = await fetch(this.baseUrl, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.ok, data.body.posts, data.message);
  }
}
