export class UserProfile {
    constructor({
        username = '',
        firstName = '',
        lastName = '',
        email = '',
        groups = null
    } = {}) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.groups = groups;
    }
    username = null
    firstName = null
    lastName = null
    email = null
    groups = null
}