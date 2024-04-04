import { API_URL } from "./consts.js";

/**
 * @typedef {Object} APIResponse
 * @property {boolean} ok
 * @property {object} body
 * @property {string} error
 */

/**
 * Turns the response into a standard object
 * @param {boolean} status
 * @param {object} body
 * @param {string} error
 * @returns {APIResponse} {@link APIResponse}
 */
const genResponse = (status, body, error) => {
  return {
    status,
    body,
    error,
  };
};

/**
 * Service for working with the authorization API
 * @class
 * @property {string} baseUrl - The base URL for the server auth service
 * @method {Promise} login - Logs in the user
 * @method {Promise} sign_up - Registers the user
 * @method {Promise} logout - Logs out the user
 */
export class AuthService {
  baseUrl = `${API_URL}/auth/`;

  /**
   * Logs in the user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<APIResponse>} {@link APIResponse}
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

    return genResponse(response.status, data.body, data.message);
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
   * @returns {Promise<APIResponse>} {@link APIResponse}
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

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Logs out the user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async logout() {
    const response = await fetch(this.baseUrl + "logout", {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      return genResponse(response.status, null, null);
    }

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }
}

/**
 * Service for working with the profile API
 * @class
 * @property {string} baseUrl - The base URL for the server posts service
 * @method getProfileData - Gets the profile's data from the server
 */
export class ProfileService {
  baseUrl = `${API_URL}/profile/`;

  /**
   * Gets the own profile's data from the server
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getOwnProfileData() {
    const response = await fetch(this.baseUrl, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Gets the profile's data from the server
   * @param {number} userId - The ID of current user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getOtherProfileData(userId) {
    const response = await fetch(this.baseUrl + `${userId}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Updates the profile's data on the server
   * @param {string} firstName - The first name of current user
   * @param {string} lastName - The last name of current user
   * @param {string} email - The email of current user
   * @param {string} password - The password of current user
   * @param {string} repeatPassword - The repeated password of current user
   * @param {string} dateOfBirth - The date of birth of current user
   * @param {File} avatar - The avatar of current user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async updateProfileData(
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

    const response = await fetch(this.baseUrl, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Delete the profile from the server
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async deleteProfile() {
    const response = await fetch(this.baseUrl, {
      method: "DELETE",
      credentials: "include",
    });

    await response.json();

    return genResponse(response.status, null, null);
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
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getPosts(userId, lastPostId) {
    const response = await fetch(
      this.baseUrl + `?userId=${userId}&lastPostId=${lastPostId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Publishes the posts to the server
   * @param {string} content - The text content of post
   * @param {File[]} attachments - The images of post
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async publishPost(content, attachments) {
    const formData = new FormData();

    formData.append("content", content);

    Array.from(attachments).forEach((elem) => {
      formData.append("attachments", elem);
    });

    const response = await fetch(this.baseUrl, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Deletes the post from the server
   * @param {number} post_id - The ID of post
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async deletePost(post_id) {
    const postId = Number(post_id);

    const response = await fetch(this.baseUrl, {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({ postId }),
    });

    if (response.status === 204) {
      return genResponse(response.status, null, null);
    }
    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Updates the post from the server
   * @param {number} post_id - The ID of post
   * @param {string} content - The text content of current post
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async updatePost(post_id, content) {
    const postId = Number(post_id);

    const response = await fetch(this.baseUrl, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ postId, content }),
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }
}

export class ChatService {
  baseUrl = `${API_URL}/chat`;

  async getDialogs() {
    const response = await fetch(this.baseUrl + '/dialogs', {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  async getMessages(companionId, lastMessage) {
    const response = await fetch(this.baseUrl + `/messages?peerId=${companionId}&lastMessageId=${lastMessage}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }
}

export class FriendsService {
  baseUrl = `${API_URL}/subscriptions/friends`;

  /**
   * Gets friends of session's user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getFriends() {
    const response = await fetch(this.baseUrl, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }
}

export class SubscribersService {
  baseUrl = `${API_URL}/subscriptions/subscribers`;

  /**
   * Gets subscribers of session's user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getSubscribers() {
    const response = await fetch(this.baseUrl, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }
}

export class SubscriptionsService {
  baseUrl = `${API_URL}/subscriptions/`;

  /**
   * Gets subscriptions of session's user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getSubscriptions() {
    const response = await fetch(this.baseUrl + "subscriptions", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Subscribes to current user by him ID
   * @param {number} userId - The ID of user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async postSubscription(userId) {
    const subscribedTo = Number(userId);

    const response = await fetch(this.baseUrl, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ subscribedTo }),
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Unsubscribes current user by him ID
   * @param {number} userId - The ID of user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async deleteSubscription(userId) {
    const subscribedTo = Number(userId);

    const response = await fetch(this.baseUrl, {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({ subscribedTo }),
    });

    if (response.status === 204) {
      return genResponse(response.status, null, null);
    }

    const data = response.json();

    return genResponse(response.status, data.body, data.message);
  }
}
