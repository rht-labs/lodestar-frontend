import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSession, AuthProvider, AuthState } from '../auth_context';
import { UserToken } from '../../../schemas/user_token';
import { UserProfile } from '../../../schemas/user_profile';

describe('Auth Context', () => {
  test('If authService is undefined, authStatus should be unauthenticated', async () => {
    const { waitForNextUpdate, result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <AuthProvider authService={undefined}>{children}</AuthProvider>
      ),
    });
    await act(async () => {
      result.current.checkAuthStatus();
      await waitForNextUpdate();
    });
    expect(result.current.authState).toEqual(AuthState.unauthenticated);
  });
  test('If the user does not have the reader role, the authState should be unauthorized', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <AuthProvider
          authService={{
            async isLoggedIn() {
              return true;
            },
            getToken() {
              return UserToken.fromFake();
            },
            async getUserProfile() {
              let profile = UserProfile.fromFake();
              profile.groups = [];
              return profile;
            },
          }}
        >
          {children}
        </AuthProvider>
      ),
    });
    await act(async () => {
      result.current.checkAuthStatus();
      await waitForNextUpdate();
    });
    expect(result.current.authState).toEqual(AuthState.unauthorized);
  });

  test('handle login callback logs in when an auth code successfully exchanges for a token', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <AuthProvider
          authService={{
            async fetchToken() {
              return UserToken.fromFake();
            },
            async isLoggedIn() {
              return true;
            },
            async getUserProfile() {
              return UserProfile.fromFake();
            },
          }}
        >
          {children}
        </AuthProvider>
      ),
    });
    await act(async () => {
      result.current.handleLoginCallback('');
      await waitForNextUpdate();
    });
    expect(result.current.authState).toBe(AuthState.initial);
  });
  test('auth status is unauthenticated when there is an error handling the login callback', async () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <AuthProvider
          authService={{
            async fetchToken() {
              throw Error('an error');
            },
          }}
        >
          {children}
        </AuthProvider>
      ),
    });
    await act(async () => {
      result.current.handleLoginCallback();
      await waitForNextUpdate();
    });
    expect(result.current.authState).toEqual(AuthState.unauthenticated);
    spy.mockReset();
  });
  test('logout calls the auth service logout', async () => {
    const clearSession = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }) => {
        return (
          <AuthProvider authService={{ clearSession }}>{children}</AuthProvider>
        );
      },
    });
    await act(async () => {
      result.current.logout();
    });
    expect(clearSession).toHaveBeenCalled();
  });
});
