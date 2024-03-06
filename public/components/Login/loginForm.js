const inputs = [
    {
        incorrect: 'incorrect-email',
        type: 'text',
        id: 'email',
        name: 'email',
        placeholder: 'Email'
    },
    {
        incorrect: 'incorrect-password',
        type: 'password',
        id: 'password',
        name: 'password',
        placeholder: 'Password'
    }
]

export class LoginForm {
    #parent

    constructor(parent) {
        this.#parent = parent;
    }

    renderForm() {
        const template = HandleBars.templates['login.hbs'];
        this.#parent.innerHTML = template({inputs});
    }

}
