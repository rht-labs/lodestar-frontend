import { UserToken } from '../../../models/user_token';
import { UserProfile } from '../../../models/user_profile';

export class FakedAuthenticationRepository {
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
