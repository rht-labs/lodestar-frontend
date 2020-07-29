import { UserToken } from '../../../schemas/user_token';
import { UserProfile } from '../../../schemas/user_profile';
import { AuthService } from '../authentication_service';

export class FakedAuthService implements AuthService {
  saveToken(token: UserToken): void {
    return;
  }
  clearSession(): void {
    return;
  }
  async isLoggedIn(): Promise<boolean> {
    return true;
  }
  async fetchToken(code: string, grantType: string): Promise<UserToken> {
    return UserToken.fromFake();
  }
  async getUserProfile(): Promise<UserProfile> {
    return UserProfile.fromFake();
  }
  getToken(): UserToken | null {
    return UserToken.fromFake();
  }
}
