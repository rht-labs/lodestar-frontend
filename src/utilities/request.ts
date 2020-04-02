import { AuthenticationRepository } from '../repositories/authentication/authentication_repository';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
export class Request {
  constructor({
    authenticationRepository,
  }: {
    authenticationRepository: AuthenticationRepository;
  }) {
    this.authenticationRepository = authenticationRepository;
    this.client = axios.create({});
    this.client.interceptors.request.use(this.beforeRequest);
    this.client.interceptors.response.use(
      this.onRequestSuccess,
      this.onRequestFailure
    );
  }

  private authenticationRepository: AuthenticationRepository;

  public client: AxiosInstance;

  private beforeRequest(request: AxiosRequestConfig) {
    const accessToken = this.authenticationRepository.getToken()?.accessToken;
    request.headers.Authorization = `Bearer ${accessToken}`;
    return request;
  }

  private onRequestSuccess(response: AxiosResponse) {
    return response;
  }
  
  private onRequestFailure(error: { response: AxiosResponse }) {
    const { response } = error;
    if (response.status >= 400 && response.status < 500) {
      this.authenticationRepository.clearSession();
      window.location.reload();
    }
    return error;
  }
}
