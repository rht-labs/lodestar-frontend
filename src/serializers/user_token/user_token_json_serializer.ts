import { Serializer } from '../serializer';
import { UserToken } from '../../schemas/user_token';
export class UserTokenJsonSerializer implements Serializer<UserToken, object> {
  serialize(token: UserToken) {
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      accessTokenExpiry: token.accessTokenExpiry.toISOString(),
      refreshTokenExpiry: token.refreshTokenExpiry.toISOString(),
    };
  }

  deserialize(data: object) {
    return {
      accessToken: data['accessToken'] as string,
      refreshToken: data['refreshToken'] as string,
      accessTokenExpiry: new Date(
        Date.parse(data['accessTokenExpiry'] as string)
      ),
      refreshTokenExpiry: new Date(
        Date.parse(data['refreshTokenExpiry'] as string)
      ),
    };
  }
}
