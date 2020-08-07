import Axios, { AxiosInstance } from 'axios';
import { UserToken } from '../../../schemas/user_token';
import qs from 'querystring';
import { UserProfile } from '../../../schemas/user_profile';
import { AuthService } from '../authentication_service';
import { Config } from '../../../schemas/config';
import { Logger } from '../../../utilities/logger';

export class Apiv1AuthService implements AuthService {
  constructor(config: Config) {
    this.config = config;
    this.axios = Axios.create({ baseURL: config.authBaseUrl });
  }

  config: Config;

  axios: AxiosInstance;

  saveToken(tokenObject: UserToken) {
    UserToken.token = tokenObject;
  }

  async clearSession() {
    this.saveToken(null);
  }

  getToken = () => {
    return UserToken.token;
  };

  isLoggedIn = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
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
    const tokenUrl = `${this?.config.authBaseUrl}/token`;
    let requestParams = {};
    if (grantType === 'authorization_code') {
      requestParams = {
        code,
        grant_type: 'authorization_code',
        client_id: this?.config.clientId,
        redirect_uri: `${this?.config.baseUrl}/auth_callback`,
      };
    } else if (grantType === 'refresh_token') {
      requestParams = {
        grant_type: 'refresh_token',
        refresh_token: code,
        client_id: this?.config.clientId,
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

  async getUserProfile(): Promise<UserProfile> {
    const userProfileData = await this.axios.get(
      `${this?.config.authBaseUrl}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()?.accessToken}`,
        },
      }
    );
    return {
      username: userProfileData.data.preferred_username,
      firstName: userProfileData.data.given_name,
      lastName: userProfileData.data.family_name,
      email: userProfileData.data.email,
      groups: userProfileData.data.groups,
    };
  }
}
