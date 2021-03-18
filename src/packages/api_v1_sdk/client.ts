import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Token } from './token';

export function getApiV1HttpClient(baseURL): AxiosInstance {
  const client = axios.create({ baseURL });
  client.interceptors.request.use((request: AxiosRequestConfig) => {
    request.headers.Authorization = `Bearer ${Token.token?.accessToken}`;
    return request;
  });
  return client;
}
