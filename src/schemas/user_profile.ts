import faker from 'faker';
import { AppFeature } from '../common/app_features';

export interface UserProfile {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  groups?: AppFeature[];
}

export abstract class UserProfile {
  static getDisplayName(userProfile: UserProfile): string {
    if (userProfile?.firstName) {
      return userProfile?.firstName;
    } else {
      return userProfile?.email || '';
    }
  }

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
