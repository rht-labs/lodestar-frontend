import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiV1 } from './apiv1';
import { Token } from './token';

export function getApiV1HttpClient(useAuth = true): AxiosInstance {
  ApiV1.validateConfig();
  const client = axios.create({ baseURL: ApiV1.config.backendUrl });
  client.interceptors.request.use((request: AxiosRequestConfig) => {
    if(useAuth) {
      request.headers.Authorization = `Bearer ${Token.token?.accessToken}`;
    }
    return request;
  });
  client.interceptors.response.use(
    async res => {
      return res;
    },
    async error => {
      return Promise.reject(error);
    }
  );
  return client;
}
