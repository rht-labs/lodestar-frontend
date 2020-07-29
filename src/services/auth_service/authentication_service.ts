import { UserToken } from '../../schemas/user_token_schema';
import { UserProfile } from '../../schemas/user_profile_schema';

export interface AuthService {
  saveToken(token: UserToken): void;
  clearSession(): void;
  isLoggedIn(): Promise<boolean>;
  fetchToken(code: string, grantType: string): Promise<UserToken>;
  getUserProfile(): Promise<UserProfile>;
  getToken(): UserToken | null;
}
