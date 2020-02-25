export class UserProfile {
    constructor({
        username = '',
        firstName = '',
        lastName = '',
        email = ''
    } = {}) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
    username = null
    firstName = null
    lastName = null
    email = null
}