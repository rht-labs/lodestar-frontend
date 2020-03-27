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
  get displayName(): string {
    if (this.firstName) {
      return this.firstName;
    } else {
      return this.email || '';
    }
  }
  groups?: string[];
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}
