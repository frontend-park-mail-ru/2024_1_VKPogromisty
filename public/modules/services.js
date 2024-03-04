export class AuthService {
    
    baseUrl = "http://localhost:8080/api/v1/auth/";

    async login(email, password) {

        const response = await fetch(this.baseUrl + "login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            return null;
        }
    }

    async isAuthorized() {
        const response = await fetch(this.baseUrl + 'is-authorized', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        return data.body?.isAuthorized;
    }

    async sign_up(firstName, lastName, email, password, repeatPassword, dateOfBirth, avatar) {

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('repeatPassword', repeatPassword);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('avatar', avatar);

        const response = await fetch(this.baseUrl + "signup", {
            method: 'POST',
            headers: {
            },
            body: formData,
            credentials: 'include',
        });

        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            return null;
        }

    }

    async logout() {

        try{
            const response = await fetch(this.baseUrl + 'logout', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            if (response.ok) {
                return;
            } else {
                const data = await response.json();
                throw new Error(data.error);
            }
        }

        catch (e){
            console.log(e)
        }
    }

}

export class PostService {
    
    baseUrl = "http://localhost:8080/api/v1/posts/";

    async getPosts() {

        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            return data.body.posts;
        } else {
            throw new Error(data.message);
        }

    }

}