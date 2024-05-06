import { API_URL } from "./consts.js";
import CSRFProtection from "../components/CSRFProtection.js";

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
    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
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
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `${userId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

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
    avatar,
  ) {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    if (password !== "") {
      formData.append("password", password);
      formData.append("repeatPassword", repeatPassword);
    }
    formData.append("avatar", avatar);

    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
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
    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      return genResponse(response.status, null, null);
    }

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Searches profiles by current query
   *
   * @param {string} query - The current searching query
   * @returns
   */
  async searchProfile(query) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `search?query=${query}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
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
   *
   * @param {number} lastPostId - The ID of last post
   * @param {number} userId - The ID of current user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getPosts(userId, lastPostId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `?userId=${userId}&lastPostId=${lastPostId}&postsAmount=0`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  async getCurrentPost(postId) {
    const response = await CSRFProtection.addCSRFToken(this.baseUrl + postId, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Gets the friends' posts from the server
   *
   * @param {number} lastPostId - The ID of last post
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getFriendsPosts(lastPostId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `friends?lastPostId=${lastPostId}&postsAmount=0`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Gets the groups' posts from the server
   *
   * @param {number} lastPostId - The ID of last post
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getGroupsPosts(lastPostId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `groups?lastPostId=${lastPostId}&postsAmount=0`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Gets the all posts from the server of groups and friends which user subscribed on
   *
   * @param {number} lastPostId - The ID of last post
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getAllPosts(lastPostId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `all?lastPostId=${lastPostId}&postsAmount=0`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Gets the all posts from the server
   *
   * @param {number} lastPostId - The ID of last post
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getNewPosts(lastPostId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `new?lastPostId=${lastPostId}&postsAmount=0`,
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

    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Likes current post
   *
   * @param {number} post_id - The ID of current post
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async likePost(post_id) {
    const postId = Number(post_id);

    const response = await CSRFProtection.addCSRFToken(this.baseUrl + "like", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ postId }),
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Unlikes current post
   *
   * @param {number} post_id - The ID of current post
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async unlikePost(post_id) {
    const postId = Number(post_id);

    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + "unlike",
      {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ postId }),
      },
    );

    if (response.status === 204) {
      return genResponse(response.status, null, null);
    }

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

    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
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

    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ postId, content }),
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }
}

/**
 * Service for working with the dialogs API
 * @class
 * @property {string} baseUrl - The base URL for the server chats service
 * @method getDialogs - Gets the dialogs from the server
 * @method getMessages - Gets the messages of current conversation from the server
 */
export class ChatService {
  baseUrl = `${API_URL}/chat`;

  /**
   * Gets the dialogs from the server
   *
   * @returns {Promise<APIResponse>} {@link ApiResponse}
   */
  async getDialogs() {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + "/dialogs",
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Gets the dialogs from the server
   *
   * @param {number} companionId - The ID of current companion
   * @param {number} lastMessageId - The ID of last message in conversation
   * @param {number} [messagesAmount=20] - The amount of messages
   * @returns {Promise<APIResponse>} {@link ApiResponse}
   */
  async getMessages(companionId, lastMessageId, messagesAmount = 20) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl +
        `/messages?peerId=${companionId}&lastMessageId=${lastMessageId}&messagesAmount=${messagesAmount}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }
}

/**
 * Service for working with the friends API
 * @class
 * @property {string} baseUrl - The base URL for the server friends service
 * @method getFriends - Gets the friends from the server
 */
export class FriendsService {
  baseUrl = `${API_URL}/subscriptions/friends`;

  /**
   * Gets friends of session's user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getFriends() {
    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }
}

/**
 * Service for working with the subscribers API
 * @class
 * @property {string} baseUrl - The base URL for the server subscribers service
 * @method getSubscribers - Gets the subscribers from the server
 */
export class SubscribersService {
  baseUrl = `${API_URL}/subscriptions/subscribers`;

  /**
   * Gets subscribers of session's user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getSubscribers() {
    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }
}

/**
 * Service for working with the subscriptions API
 * @class
 * @property {string} baseUrl - The base URL for the server subscriptions service
 * @method getDialogs - Gets the subscriptions from the server
 * @method postSubscription - Post the subscription on the server
 * @method deleteSubscription - Delete the current subscription from the server
 */
export class SubscriptionsService {
  baseUrl = `${API_URL}/subscriptions/`;

  /**
   * Gets subscriptions of session's user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getSubscriptions() {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + "subscriptions",
      {
        method: "GET",
        credentials: "include",
      },
    );

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

    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
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

    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
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

/**
 * Service for working with the group API
 * @class
 * @property {string} baseUrl - The base URL for the server group service
 */
export class GroupService {
  baseUrl = `${API_URL}/groups/`;

  /**
   * Gets group which user subscribes to
   *
   * @param {number} userId  - The ID of user
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getUserSubGroups(userId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `by-sub/${userId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Gets the group's data from the server
   * @param {number} groupId - The ID of current group
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getGroupData(groupId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `${groupId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Creates group
   *
   * @param {string} name - The name of group
   * @param {string} description - The description of group
   * @param {File} avatar - The avatar of group
   *
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async createGroup(name, description, avatar) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("avatar", avatar);

    const response = await CSRFProtection.addCSRFToken(this.baseUrl, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Updates group
   *
   * @param {number} groupId - The ID of group
   * @param {string} name - The name of group
   * @param {string} description - The description of group
   * @param {File} avatar - The avatar of group
   *
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async updateGroup(groupId, name, description, avatar) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("avatar", avatar);

    const response = await CSRFProtection.addCSRFToken(this.baseUrl + groupId, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Deletes the group from the server
   *
   * @param {number} groupId - The ID of group
   *
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async deleteGroup(groupId) {
    const response = await CSRFProtection.addCSRFToken(this.baseUrl + groupId, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      return genResponse(response.status, null, null);
    }

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Gets posts of group
   *
   * @param {number} groupId - The ID of group
   * @param {number} lastPostId - The ID of last rendered post
   *
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getPosts(groupId, lastPostId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `${groupId}/posts/?lastPostId=${lastPostId}&postsAmount=0`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Searches groups by current query
   *
   * @param {string} query - The current searching query
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async searchGroup(query) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `search?query=${query}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Subscribes to current group by her ID
   *
   * @param {number} groupId - The ID of group
   *
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async postSubscription(groupId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `${groupId}/sub`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Unsubscribes current group by her ID
   *
   * @param {number} groupId - The ID of group
   *
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async deleteSubscription(groupId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `${groupId}/unsub`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (response.status === 204) {
      return genResponse(response.status, null, null);
    }

    const data = response.json();

    return genResponse(response.status, data.body, data.message);
  }

  async isAdmin(groupId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `${groupId}/admins/check`,
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
   *
   * @param {number} groupId - The ID of group
   * @param {string} content - The text content of post
   * @param {File[]} attachments - The images of post
   *
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async publishPost(groupId, content, attachments) {
    const formData = new FormData();

    formData.append("content", content);

    Array.from(attachments).forEach((elem) => {
      formData.append("attachments", elem);
    });

    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `${groupId}/posts/`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Gets list of admins
   *
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async getAdminsList(groupId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `${groupId}/admins/`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Deletes current admin
   *
   * @param {number} adminId - The ID of current admin
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async deleteAdmin(groupId, adminId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `${groupId}/admins/`,
      {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ userId: +adminId }),
      },
    );

    if (response.status === 204) {
      return genResponse(response.status, null, null);
    }

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }

  /**
   * Creates new admin
   *
   * @param {number} userId - The ID of current admin
   * @returns {Promise<APIResponse>} {@link APIResponse}
   */
  async addAdmin(groupId, userId) {
    const response = await CSRFProtection.addCSRFToken(
      this.baseUrl + `${groupId}/admins/`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ userId: +userId }),
      },
    );

    const data = await response.json();

    return genResponse(response.status, data.body, data.message);
  }
}
