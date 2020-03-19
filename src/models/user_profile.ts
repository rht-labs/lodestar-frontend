interface UserProfileParams {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export class UserProfile {
  constructor({
    username = '',
    firstName = '',
    lastName = '',
    email = '',
  }: UserProfileParams = {}) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}
