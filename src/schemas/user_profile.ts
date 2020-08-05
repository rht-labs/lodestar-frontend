import faker from 'faker';

export interface UserProfile {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  groups?: string[];
}

export abstract class UserProfile {
  static getDisplayName(userProfile: UserProfile): string {
    if (userProfile?.firstName) {
      return userProfile?.firstName;
    } else {
      return userProfile?.email || '';
    }
  }
  groups?: string[];
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;

  static fromFake() {
    return {
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      groups: ['reader', 'writer'],
    };
  }
}
