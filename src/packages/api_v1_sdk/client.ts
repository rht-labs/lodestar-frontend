import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Apiv1AuthService } from './apiv1_auth_service';
import { Token } from './token';

export function getApiV1HttpClient(baseURL: string): AxiosInstance {
  const client = axios.create({ baseURL });
  client.interceptors.request.use((request: AxiosRequestConfig) => {
    request.headers.Authorization = `Bearer ${Token.token?.accessToken}`;
    return request;
  });
  client.interceptors.response.use(async res => {
    if (res.status === 401 || res.status === 403) {
      console.log('retrying request');
      const authService = new Apiv1AuthService();
      await authService.isLoggedIn();
      const retriedResponse = await axios.request(res.config);
      return retriedResponse;
    }
    return res;
  });
  return client;
}
