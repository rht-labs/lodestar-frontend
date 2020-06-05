import { AuthService } from '../services/authentication_service/authentication_service';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { Logger } from './logger';
export class Request {
  constructor({
    authenticationRepository,
  }: {
    authenticationRepository: AuthService;
  }) {
    this.authenticationRepository = authenticationRepository;
    this.client = axios.create({});
    this.client.interceptors.request.use(this.beforeRequest);
    this.client.interceptors.response.use(
      this.onRequestSuccess,
      this.onRequestFailure
    );
  }

  private authenticationRepository: AuthService;

  client: AxiosInstance;

  public beforeRequest = async (request: AxiosRequestConfig) => {
    if (await this.authenticationRepository.isLoggedIn()) {
      const token = this.authenticationRepository.getToken();
      const accessToken = token?.accessToken;
      request.headers.Authorization = `Bearer ${accessToken}`;
      return request;
    } else {
      throw Error('The user is not authenticated');
    }
  };

  public onRequestSuccess = (response: AxiosResponse) => {
    return response;
  };

  public onRequestFailure = (error: any) => {
    const { response } = error;
    if (response?.status === 401 || response?.status === 403) {
      Logger.log('Unauthenticated request', response.status);
      this.authenticationRepository.clearSession();
      window.location.reload();
    }
    throw error;
  };
}
