import { Serializer } from '../serializer';
<<<<<<< HEAD
import { UserToken } from '../../schemas/user_token';
=======
import { UserToken } from '../../schemas/user_token_schema';
>>>>>>> cde2afbe73daa4bc5ee39fbcca36d15c0b95982c
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
    return new UserToken({
      accessToken: data['accessToken'] as string,
      refreshToken: data['refreshToken'] as string,
      accessTokenExpiry: new Date(
        Date.parse(data['accessTokenExpiry'] as string)
      ),
      refreshTokenExpiry: new Date(
        Date.parse(data['refreshTokenExpiry'] as string)
      ),
    });
  }
}
