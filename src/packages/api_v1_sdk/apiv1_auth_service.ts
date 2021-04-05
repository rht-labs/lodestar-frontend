import Axios, { AxiosInstance } from 'axios';
import { UserToken } from '../../schemas/user_token';
import qs from 'query-string';
import { UserProfile } from '../../schemas/user_profile';
import { AuthService } from '../../services/auth_service/authentication_service';
import { Config } from '../../schemas/config';
import { Logger } from '../../utilities/logger';
import { AppFeature } from '../../common/app_features';
import { Token } from './token';

interface AuthConfig {
  authBaseUrl: string;
  baseUrl: string;
  clientId: string;
}
export class Apiv1AuthService implements AuthService {
  private static config?: AuthConfig;
  static initialize(config: AuthConfig) {
    Apiv1AuthService.axios = Axios.create({ baseURL: config.authBaseUrl });
    Apiv1AuthService.config = config;
  }

  config: Config;

  private static axios: AxiosInstance;

  saveToken(tokenObject: UserToken) {
    Token.token = tokenObject;
  }

  private static validateConfig() {
    if (!Apiv1AuthService.config) {
      throw TypeError(
        'Apiv1AuthService.initialize must be called before using the auth service'
      );
    }
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
          resolve(false);
        }
      } catch (e) {
        Logger.instance.error(e);
        resolve(false);
      }
    });
  };

  async fetchToken(code: string, grantType: string) {
    Apiv1AuthService.validateConfig();
    const tokenUrl = `${Apiv1AuthService?.config.authBaseUrl}/token`;
    let requestParams = {};
    if (grantType === 'authorization_code') {
      requestParams = {
        code,
        grant_type: 'authorization_code',
        client_id: Apiv1AuthService?.config.clientId,
        redirect_uri: `${Apiv1AuthService?.config.baseUrl}/auth_callback`,
      };
    } else if (grantType === 'refresh_token') {
      requestParams = {
        grant_type: 'refresh_token',
        refresh_token: code,
        client_id: Apiv1AuthService?.config.clientId,
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

  private async getRolesMap(): Promise<{ [key: string]: AppFeature }> {
    return {
      reader: 'reader',
      writer: 'writer',
    };
  }

  async getUserProfile(): Promise<UserProfile> {
    Apiv1AuthService.validateConfig();
    const userProfileData = await Apiv1AuthService.axios.get(
      `${Apiv1AuthService?.config.authBaseUrl}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()?.accessToken}`,
        },
      }
    );
    const rolesMap = await this.getRolesMap();
    return {
      username: userProfileData.data.preferred_username,
      firstName: userProfileData.data.given_name,
      lastName: userProfileData.data.family_name,
      email: userProfileData.data.email,
      groups: Array.from(
        new Set(
          userProfileData.data.groups?.map?.(
            (group: string) => rolesMap[group]
          ) ?? []
        )
      ),
    };
  }
}
