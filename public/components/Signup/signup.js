const main_inputs = [
    {
        incorrect: 'incorrect-last-name',
        id: 'last-name',
        type: 'text',
        name: 'last_name',
        placeholder: 'Last name',
    },
    {
        incorrect: 'incorrect-first-name',
        id: 'first-name',
        type: 'text',
        name: 'first_name',
        placeholder: 'First name',
    },
    {
        incorrect: 'incorrect-password',
        id: 'password',
        type: 'password',
        name: 'password',
        placeholder: 'Password',
    },
    {
        incorrect: 'incorrect-repeat-password',
        id: 'repeat-password',
        type: 'password',
        name: 'repeat_password',
        placeholder: 'Repeat password',
    },
    {
        incorrect: 'incorrect-email',
        id: 'email',
        type: 'email',
        name: 'email',
        placeholder: 'Email',
    },
]

const part_of_date = [
    {
        id: 'day',
        placeholder: 'DD',
    },
    {
        id: 'month',
        placeholder: 'MM',
    },
    {
        id: 'year',
        placeholder: 'YYYY',
    }
]

export class SignUpForm {

    #parent

    constructor(parent) {
        this.#parent = parent;
    }

    renderSignUpForm() {
        const template = Handlebars.templates['signup.hbs'];
        this.#parent.innerHTML = template({main_inputs, part_of_date});
    }

}
