import faker from 'faker';

export interface UserTokenParams {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiry?: Date;
  refreshTokenExpiry?: Date;
}

export class UserToken {
  constructor({
    accessToken = '',
    refreshToken = '',
    accessTokenExpiry = new Date(),
    refreshTokenExpiry = new Date(),
  }: UserTokenParams = {}) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessTokenExpiry = accessTokenExpiry;
    this.refreshTokenExpiry = refreshTokenExpiry;
  }
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry = new Date();
  refreshTokenExpiry = new Date();

  toMap() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      accessTokenExpiry: this.accessTokenExpiry.toISOString(),
      refreshTokenExpiry: this.refreshTokenExpiry.toISOString(),
    };
  }
  /**
   *
   * @returns {UserToken}
   */
  static fromMap(map: { [key: string]: unknown }) {
    return new UserToken({
      accessToken: map['accessToken'] as string,
      refreshToken: map['refreshToken'] as string,
      accessTokenExpiry: new Date(
        Date.parse(map['accessTokenExpiry'] as string)
      ),
      refreshTokenExpiry: new Date(
        Date.parse(map['refreshTokenExpiry'] as string)
      ),
    });
  }

  static fromFake() {
    return new UserToken({
      accessToken: faker.random.uuid(),
      refreshToken: faker.random.uuid(),
      accessTokenExpiry: faker.date.future(),
      refreshTokenExpiry: faker.date.future(),
    });
  }
}
