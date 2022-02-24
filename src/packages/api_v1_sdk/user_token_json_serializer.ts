import { Serializer } from '../../serializers/serializer';
import { UserToken } from '../../schemas/user_token';
export class UserTokenJsonSerializer implements Serializer<UserToken, object> {
  serialize(token: UserToken) {
    if (!token) {
      return null;
    }
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  deserialize(data: object) {
    if (!data['accessToken'] || !data['refreshToken']) {
      throw new TypeError('not a valid token');
    }
    return {
      accessToken: data['accessToken'] as string,
      refreshToken: data['refreshToken'] as string,
    };
  }
}
