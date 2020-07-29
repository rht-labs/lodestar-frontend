import { UserToken } from '../../schemas/user_token';
import { UserProfile } from '../../schemas/user_profile';

export interface AuthService {
  saveToken(token: UserToken): void;
  clearSession(): void;
  isLoggedIn(): Promise<boolean>;
  fetchToken(code: string, grantType: string): Promise<UserToken>;
  getUserProfile(): Promise<UserProfile>;
  getToken(): UserToken | null;
}
