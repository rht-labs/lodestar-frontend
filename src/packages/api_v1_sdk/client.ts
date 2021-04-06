import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Apiv1AuthService } from './apiv1_auth_service';
import { ApiV1 } from './apiv1';
import { Token } from './token';

export function getApiV1HttpClient(): AxiosInstance {
  ApiV1.validateConfig();
  const client = axios.create({ baseURL: ApiV1.config.backendUrl });
  client.interceptors.request.use((request: AxiosRequestConfig) => {
    request.headers.Authorization = `Bearer ${Token.token?.accessToken}`;
    return request;
  });
  client.interceptors.response.use(
    async res => {
      return res;
    },
    async error => {
      if (error.response.status === 401 || error.response.status === 403) {
        const authService = new Apiv1AuthService();
        try {
          await authService.isLoggedIn();
          const retriedResponse = await axios.request(error.config);
          return retriedResponse;
        } catch (e) {
          return Promise.reject(e);
        }
      }
      return Promise.reject(error);
    }
  );
  return client;
}
