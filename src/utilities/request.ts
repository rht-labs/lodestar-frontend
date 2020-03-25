import { AuthenticationRepository } from '../repositories/authentication/authentication_repository';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
export class Request {
  private static instance: AxiosInstance;
  static get client() {
    if (!Request.instance) {
      Request.instance = axios.create({});
      Request.instance.interceptors.request.use(Request.beforeRequest);
      Request.instance.interceptors.response.use(
        Request.onRequestSuccess,
        Request.onRequestFailure
      );
    }
    return Request.instance;
  }
  private static beforeRequest(request: AxiosRequestConfig) {
    const accessToken = AuthenticationRepository.getToken()?.accessToken;
    request.headers.Authorization = `Bearer ${accessToken}`;
    return request;
  }
  private static onRequestSuccess(response: AxiosResponse) {
    return response;
  }
  private static onRequestFailure(error: { response: AxiosResponse }) {
    const { response } = error;
    if (response.status >= 400 && response.status < 500) {
      AuthenticationRepository.clearSession();
      window.location.reload();
    }
    return error;
  }
}
