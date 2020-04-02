import { UserToken } from '../../models/user_token';
import { UserProfile } from '../../models/user_profile';

export abstract class AuthenticationRepository {
  abstract saveToken(token: UserToken): void;
  abstract clearSession(): void;
  abstract isLoggedIn(): Promise<boolean>;
  abstract fetchToken(code: string, grantType: string): Promise<UserToken>;
  abstract getUserProfile(): Promise<UserProfile>;
  abstract getToken(): UserToken | null;
}
