import { API_URL } from "./consts.js";

const genResponse = (ok, body, error) => {
  return {
    ok: ok,
    body: body,
    error: error,
  };
};

export class AuthService {
  baseUrl = `${API_URL}/auth/`;

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

  async isAuthorized() {
    const response = await fetch(this.baseUrl + "is-authorized", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.ok, data.body.isAuthorized, data.message);
  }

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

  async logout() {
    const response = await fetch(this.baseUrl + "logout", {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      return;
    }

    return genResponse(response.ok, null, data.message);
  }
}

export class PostService {
  baseUrl = `${API_URL}/posts/`;

  async getPosts() {
    const response = await fetch(this.baseUrl, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return genResponse(response.ok, data.body.posts, data.message);
  }
}
