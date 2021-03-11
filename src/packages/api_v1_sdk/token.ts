import { UserToken } from '../../schemas/user_token';
import { Serializer } from '../../serializers/serializer';
import { UserTokenJsonSerializer } from './user_token_json_serializer';

export class LocalStoragePersistence implements PersistenceStrategy {
  private static TOKEN_STORAGE_KEY: string = 'token';
  private static serializer: Serializer<
    Token,
    any
  > = new UserTokenJsonSerializer();
  saveToken(token?: Token) {
    localStorage.setItem(
      LocalStoragePersistence.TOKEN_STORAGE_KEY,
      JSON.stringify(LocalStoragePersistence.serializer.serialize(token))
    );
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
interface PersistenceStrategy {
  saveToken(token: UserToken): void;
  getToken(): UserToken;
}
export abstract class Token {
  private static _persistenceStrategy: PersistenceStrategy = new LocalStoragePersistence();

  public static get token() {
    return Token._persistenceStrategy.getToken();
  }

  public static set token(token: UserToken) {
    Token._persistenceStrategy.saveToken(token);
  }

  public static set persistenceStrategy(strategy: PersistenceStrategy) {
    Token._persistenceStrategy = strategy;
  }
}
