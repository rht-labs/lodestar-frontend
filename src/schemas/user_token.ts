import faker from 'faker';

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiry?: Date;
  refreshTokenExpiry?: Date;
}

export abstract class UserToken {
  static fromFake(): UserToken {
    return {
      accessToken: faker.random.uuid(),
      refreshToken: faker.random.uuid(),
      accessTokenExpiry: faker.date.future(),
      refreshTokenExpiry: faker.date.future(),
    };
  }
}
