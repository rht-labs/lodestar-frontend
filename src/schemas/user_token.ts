import faker from 'faker';
import { Serializer } from '../serializers/serializer';
import { UserTokenJsonSerializer } from '../serializers/user_token/user_token_json_serializer';
import { Logger } from '../utilities/logger';

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiry?: Date;
  refreshTokenExpiry?: Date;
}

export abstract class UserToken {
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

  static fromFake(): UserToken {
    return {
      accessToken: faker.random.uuid(),
      refreshToken: faker.random.uuid(),
      accessTokenExpiry: faker.date.future(),
      refreshTokenExpiry: faker.date.future(),
    };
  }
}

interface PersistenceStrategy {
  saveToken(token: UserToken): void;
  getToken(): UserToken;
}

export class LocalStoragePersistence implements PersistenceStrategy {
  private static TOKEN_STORAGE_KEY: string = 'token';
  private static serializer: Serializer<
    UserToken,
    any
  > = new UserTokenJsonSerializer();
  saveToken(token: UserToken) {
    if (
      typeof token === 'object' &&
      'accessToken' in token &&
      'refreshToken' in token
    ) {
      localStorage.setItem(
        LocalStoragePersistence.TOKEN_STORAGE_KEY,
        JSON.stringify(LocalStoragePersistence.serializer.serialize(token))
      );
    } else {
      throw TypeError(
        'Token Object must be an object containing access and refresh tokens'
      );
    }
  }
  getToken() {
    try {
      const storedToken =
        localStorage.getItem(LocalStoragePersistence.TOKEN_STORAGE_KEY) || '';
      if (!storedToken) {
        return null;
      }
      const tokenMap = JSON.parse(storedToken);

      return LocalStoragePersistence.serializer.deserialize(tokenMap);
    } catch (e) {
      return null;
    }
  }
}
