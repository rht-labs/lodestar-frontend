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

  client: AxiosInstance;

  private beforeRequest = (request: AxiosRequestConfig) => {
    const token = this.authenticationRepository.getToken();
    const accessToken = token?.accessToken;
    request.headers.Authorization = `Bearer ${accessToken}`;
    return request;
  };

  private onRequestSuccess = (response: AxiosResponse) => {
    return response;
  };

  private onRequestFailure = (error: { response: AxiosResponse }) => {
    const { response } = error;
    // TODO: Handle other request errors here
    if (response.status === 401 || response.status === 403) {
      console.log('Unauthenticated request', response.status);
      this.authenticationRepository.clearSession();
      window.location.reload();
    }
    return error;
  };
}
