import { UserToken } from '../../schemas/user_token';
import { UserProfile } from '../../schemas/user_profile';

export abstract class AuthService {
  abstract saveToken(token: UserToken): void;
  abstract clearSession(): void;
  abstract isLoggedIn(): Promise<boolean>;
  abstract fetchToken(code: string, grantType: string): Promise<UserToken>;
  abstract getUserProfile(): Promise<UserProfile>;
  abstract getToken(): UserToken | null;
}
