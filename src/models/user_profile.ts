interface UserProfileParams {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  groups?: string[];
}

export class UserProfile {
  constructor({
    username = '',
    firstName = '',
    lastName = '',
    email = '',
    groups = [],
  }: UserProfileParams = {}) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.groups = groups;
  }
  groups?: string[];
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}
