import faker from 'faker';
import { Logger } from '../utilities/logger';

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

  private static _persistenceStrategy: PersistenceStrategy;
  public static setPersistenceStrategy(strategy: PersistenceStrategy) {
    UserToken._persistenceStrategy = strategy;
  }

  public static get token() {
    return UserToken._persistenceStrategy.getToken();
  }

  public static set token(token: UserToken) {
    UserToken._persistenceStrategy.saveToken(token);
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

interface PersistenceStrategy {
  saveToken(token: UserToken): void;
  getToken(): UserToken;
}

export class LocalStoragePersistenceStrategy implements PersistenceStrategy {
  private static TOKEN_STORAGE_KEY: string = 'token';
  saveToken(token: UserToken) {
    try {
      if (
        typeof token === 'object' &&
        'accessToken' in token &&
        'refreshToken' in token
      ) {
        localStorage.setItem(
          LocalStoragePersistenceStrategy.TOKEN_STORAGE_KEY,
          JSON.stringify(token.toMap())
        );
      } else {
        throw TypeError(
          'Token Object must be an object containing access and refresh tokens'
        );
      }
    } catch (e) {
      Logger.instance.error(e);
    }
  }
  getToken() {
    try {
      const storedToken =
        localStorage.getItem(
          LocalStoragePersistenceStrategy.TOKEN_STORAGE_KEY
        ) || '';
      if (!storedToken) {
        return null;
      }
      const tokenMap = JSON.parse(storedToken);

      return UserToken.fromMap(tokenMap);
    } catch (e) {
      return null;
    }
  }
}
