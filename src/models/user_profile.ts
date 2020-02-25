interface IUserProfile {
  username?: string
  firstName?: string
  lastName?: string
  email?: string
  groups?: any
}

export class UserProfile {
  constructor({
    username = '',
    firstName = '',
    lastName = '',
    email = '',
    groups = null
  }: IUserProfile = {}) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.groups = groups;
  }
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  groups?: any;
}