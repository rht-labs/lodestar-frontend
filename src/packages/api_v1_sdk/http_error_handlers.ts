import axios, { AxiosInstance } from 'axios';
import {
  AuthenticationError,
  AuthorizationError,
} from '../../services/auth_service/auth_errors';

interface AxiosError {
  response: {
    status: number;
  };
}

export function handleAxiosResponseErrors(error: AxiosError) {
  if (error.response?.status === 401) {
    throw new AuthenticationError();
  }
  if (error.response?.status === 403) {
    throw new AuthorizationError();
  }
  throw error;
}
