import {
  AuthenticationError,
  AuthorizationError,
} from '../../../context/session_context/session_errors';

interface AxiosError {
  response: {
    status: number;
  };
}

export function handleAxiosResponseErrors(error: AxiosError) {
  if (error.response.status === 401) {
    throw new AuthenticationError();
  }
  if (error.response.status === 403) {
    throw new AuthorizationError();
  }
  throw error;
}
