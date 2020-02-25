import Axios from "axios";
import { UserToken } from '../../models/user_token'

const TOKEN_STORAGE_KEY = 'token'

export class AuthenticationRepository {
    constructor() {
        this._initializeAxios()
    }


    _instance = null;

    axios;

    _initializeAxios() {
        this.axios = Axios.create();
        console.log("creating axios instance")
        this.axios.interceptors.request.use(function (config) {
            const token = this.getState().tokens.accessToken;
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`Setting axios token to ${token}`);
            return config;
        });
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new AuthenticationRepository()
        }
        return this._instance;
    }

    /**
     * 
     * @param {UserToken} tokenObject 
     */

    saveToken(tokenObject) {
        try {
            if (typeof tokenObject === 'object' && 'accessToken' in tokenObject && 'refreshToken' in tokenObject) {
                localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenObject.toMap()));
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
            const tokenMap = JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY))
            return UserToken.fromMap(tokenMap)
        } catch (e) {
            console.log(e)
            return null
        }
    }

    /**
     * @returns {Promise<boolean>}
     */
    isLoggedIn() {
        return new Promise((resolve, reject) => {
            try {
                const token = this.getToken()
                const isValid = token.accessTokenExpiry > Date.now();
                resolve(isValid)
            } catch (e) {
                reject(e)
            }
        });
    }

}