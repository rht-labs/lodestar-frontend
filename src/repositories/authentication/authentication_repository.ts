import Axios, { AxiosInstance } from "axios";
import { UserToken } from '../../models/user_token'
import qs from 'querystring'
import { AppSettings } from "../../settings/config";
import { UserProfile } from "../../models/user_profile";
const TOKEN_STORAGE_KEY = 'token'

export class AuthenticationRepository {
  constructor() {
    this.axios = this.initializeAxios()
  }

  public axios: AxiosInstance

  private static _instance?: AuthenticationRepository;

  private initializeAxios() {
    const axiosInstance = Axios.create();
    axiosInstance.interceptors.request.use(function (config) {
      const token = AuthenticationRepository.getInstance().getToken();
      if (!token) {
        return config;
      }
      config.headers.Authorization = `Bearer ${token.accessToken}`;
      return config;
    });
    return axiosInstance;
  }

  static getInstance(): AuthenticationRepository {
    if (!AuthenticationRepository._instance) {
      AuthenticationRepository._instance = new AuthenticationRepository()
    }
    return AuthenticationRepository._instance;
  }

  /**
   * 
   * @param {UserToken} tokenObject 
   */

  saveToken(tokenObject: UserToken) {
    try {
      if (typeof tokenObject === 'object' && 'accessToken' in tokenObject && 'refreshToken' in tokenObject) {
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenObject.toMap()));
        this.axios = this.initializeAxios()
      } else {
        throw TypeError('Token Object must be an object containing access and refresh tokens')
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * @returns {UserToken}
   */

  getToken() {
    try {
      const tokenMap = JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY) || '')
      if (!tokenMap) {
        return null
      }
      return UserToken.fromMap(tokenMap)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const token = this.getToken()
        const isValid = token?.accessTokenExpiry ? token.accessTokenExpiry > new Date(Date.now()) : false;
        resolve(!!isValid)
      } catch (e) {
        console.error(e)
        resolve(false)
      }
    });
  }

  async fetchToken(code: string) {
    const tokenUrl = `${AppSettings.authBaseUrl}/token`
    const requestParams = {
      code,
      grant_type: 'authorization_code',
      client_id: AppSettings.clientId,
      redirect_uri: `${AppSettings.baseUrl}/auth_callback`
    }
    const { data } = await Axios.post(tokenUrl, qs.stringify(requestParams), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': AppSettings.baseUrl,
        'Accept': '*/*'
      },
    })
    const { access_token, refresh_token, expires_in, refresh_expires_in } = data
    let currentTime = new Date();
    const userToken = new UserToken({
      accessToken: access_token as string,
      refreshToken: refresh_token as string,
      accessTokenExpiry: new Date(
        currentTime.getTime() + expires_in as number * 1000
      ),
      refreshTokenExpiry: new Date(
        currentTime.getTime() +
        refresh_expires_in * 1000 as number
      )
    })
    this.saveToken(userToken)
    return userToken
  }

  async getUserProfile() {
    const userProfileData = await this.axios.get(`${AppSettings.authBaseUrl}/userinfo`);
    return new UserProfile({
      username: userProfileData.data.preferred_username,
      firstName: userProfileData.data.given_name,
      lastName: userProfileData.data.family_name,
      email: userProfileData.data.email,
      groups: userProfileData.data.groups
    })
  }

}