import Axios, { AxiosInstance } from 'axios';
import { UserToken } from '../../../schemas/user_token_schema';
import qs from 'querystring';
import { UserProfile } from '../../../schemas/user_profile_schema';
import { ConfigContextParams } from '../../../context/config_context';
import { AuthService } from '../authentication_service';
const TOKEN_STORAGE_KEY = 'token';

export class Apiv1AuthService implements AuthService {
  constructor(config: ConfigContextParams, requestClient?: AxiosInstance) {
    this.axios = requestClient ?? Axios.create({});
    this.config = config;
  }

  config: ConfigContextParams;

  axios: AxiosInstance;

  /**
   *
   * @param {UserToken} tokenObject
   */

  saveToken(tokenObject: UserToken) {
    try {
      if (
        typeof tokenObject === 'object' &&
        'accessToken' in tokenObject &&
        'refreshToken' in tokenObject
      ) {
        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          JSON.stringify(tokenObject.toMap())
        );
      } else {
        throw TypeError(
          'Token Object must be an object containing access and refresh tokens'
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  async clearSession() {
    const logoutUrl = `${this.config.appConfig?.authBaseUrl}/logout`;
    const token = this.getToken();
    const requestParams = {
      client_id: this.config.appConfig?.clientId,
      refresh_token: token?.refreshToken ? token.refreshToken : '',
    };
    await Axios.post(logoutUrl, qs.stringify(requestParams), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
      },
    })
    localStorage.setItem(TOKEN_STORAGE_KEY, '');
    return;
  }

  getToken = () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
      if (!storedToken) {
        return null;
      }
      const tokenMap = JSON.parse(storedToken);

      return UserToken.fromMap(tokenMap);
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  /**
   * @returns {Promise<boolean>}
   */
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
        console.error(e);
        resolve(false);
      }
    });
  };

  async fetchToken(code: string, grantType: string) {
    const tokenUrl = `${this.config.appConfig?.authBaseUrl}/token`;
    let requestParams = {};
    if (grantType === 'authorization_code') {
      requestParams = {
        code,
        grant_type: 'authorization_code',
        client_id: this.config.appConfig?.clientId,
        redirect_uri: `${this.config.appConfig?.baseUrl}/auth_callback`,
      };
    } else if (grantType === 'refresh_token') {
      requestParams = {
        grant_type: 'refresh_token',
        refresh_token: code,
        client_id: this.config.appConfig?.clientId,
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
    const userToken = new UserToken({
      accessToken: access_token as string,
      refreshToken: refresh_token as string,
      accessTokenExpiry: new Date(
        (currentTime.getTime() + expires_in * 1000) as number
      ),
      refreshTokenExpiry: new Date(
        (currentTime.getTime() + refresh_expires_in * 1000) as number
      ),
    });
    this.saveToken(userToken);
    return userToken;
  }

  async getUserProfile(): Promise<UserProfile> {
    const userProfileData = await this.axios.get(
      `${this.config.appConfig?.authBaseUrl}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()?.accessToken}`,
        },
      }
    );
    return new UserProfile({
      username: userProfileData.data.preferred_username,
      firstName: userProfileData.data.given_name,
      lastName: userProfileData.data.family_name,
      email: userProfileData.data.email,
    });
  }
}
