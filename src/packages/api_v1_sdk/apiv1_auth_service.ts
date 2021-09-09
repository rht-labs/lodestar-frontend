import Axios, { AxiosInstance } from 'axios';
import { ApiV1 } from './apiv1';
import { UserToken } from '../../schemas/user_token';
import qs from 'query-string';
import { UserProfile } from '../../schemas/user_profile';
import { AuthService } from '../../services/auth_service/authentication_service';
import { Logger } from '../../utilities/logger';
import { AppFeature } from '../../common/app_features';
import { Token } from './token';
import { getApiV1HttpClient } from './client';

export class Apiv1AuthService implements AuthService {
  private axios: AxiosInstance;
  constructor() {
    this.axios = getApiV1HttpClient();
  }

  saveToken(tokenObject: UserToken) {
    Token.token = tokenObject;
  }

  async clearSession() {
    this.saveToken(null);
  }

  getToken = (): UserToken => {
    return Token.token;
  };

  isLoggedIn = async (): Promise<boolean> => {
    return new Promise(resolve => {
      try {
        const token = this.getToken();
        const accessTokenExpiryTime = token?.accessTokenExpiry.getTime();
        const now = Date.now();
        const diff = accessTokenExpiryTime ? accessTokenExpiryTime - now : 0;
        const isAccessTokenValid = !!accessTokenExpiryTime && diff > 0;
        const isRefreshTokenValid = token?.refreshTokenExpiry
          ? token.refreshTokenExpiry.getTime() > Date.now()
          : false;
        if (isAccessTokenValid) {
          // Access token is valid! Proceed as normal
          resolve(true);
        } else if (!isAccessTokenValid && isRefreshTokenValid) {
          // Fetch new access token using refresh token
          this.fetchToken(
            token?.refreshToken ? token.refreshToken : '',
            'refresh_token'
          ).then(token => {
            resolve(token && token.accessTokenExpiry.getTime() > Date.now());
          });
        } else {
          // Nothing is valid!
          this.clearSession()
          resolve(false);
        }
      } catch (e) {
        Logger.instance.error(e);
        resolve(false);
      }
    });
  };

  async fetchToken(code: string, grantType: string) {
    ApiV1.validateConfig();
    const tokenUrl = `${ApiV1?.config.authBaseUrl}/token`;
    let requestParams = {};
    if (grantType === 'authorization_code') {
      requestParams = {
        code,
        grant_type: 'authorization_code',
        client_id: ApiV1?.config.clientId,
        redirect_uri: `${ApiV1?.config.baseUrl}/auth_callback`,
      };
    } else if (grantType === 'refresh_token') {
      requestParams = {
        grant_type: 'refresh_token',
        refresh_token: code,
        client_id: ApiV1?.config.clientId,
      };
    }
    const { data } = await Axios.post(tokenUrl, qs.stringify(requestParams), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
      },
    });
    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_expires_in,
    } = data;
    const currentTime = new Date();
    const userToken: UserToken = {
      accessToken: access_token as string,
      refreshToken: refresh_token as string,
      accessTokenExpiry: new Date(
        (currentTime.getTime() + expires_in * 1000) as number
      ),
      refreshTokenExpiry: new Date(
        (currentTime.getTime() + refresh_expires_in * 1000) as number
      ),
    };
    this.saveToken(userToken);
    return userToken;
  }

  private async getUserRoles(groups: string[] = []): Promise<AppFeature[]> {
    const roleMappings = ApiV1.config.roleMapping ?? {};
    const roles = Array.from(
      new Set(
        groups.reduce<AppFeature[]>(
          (prev: AppFeature[], curr: string) => [
            ...prev,
            ...(roleMappings[curr] ?? []),
          ],
          []
        )
      )
    );
    return roles;
  }

  async getUserProfile(): Promise<UserProfile> {
    ApiV1.validateConfig();
    const userProfileData = await this.axios.get(
      `${ApiV1?.config.authBaseUrl}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()?.accessToken}`,
        },
      }
    );
    const roles = await this.getUserRoles(userProfileData.data?.groups);
    return {
      username: userProfileData.data.preferred_username,
      firstName: userProfileData.data.given_name,
      lastName: userProfileData.data.family_name,
      email: userProfileData.data.email,
      groups: roles,
    };
  }
}
