import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSession, AuthProvider } from '../auth_context';
import { UserToken } from '../../../schemas/user_token';
import { UserProfile } from '../../../schemas/user_profile';
import { AuthService } from '../../../services/auth_service/authentication_service';

describe('Auth Context', () => {
  test('If authService is undefined, authStatus should be unauthenticated', async () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children: React.ReactChild }) => (
        <AuthProvider authService={undefined}>{children}</AuthProvider>
      ),
    });
    await act(async () => {
      expect(await result.current.checkIsAuthenticated()).toBe(false);
    });
  });
  test('handle login callback logs in when an auth code successfully exchanges for a token', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children: React.ReactChild }) => (
        <AuthProvider
          authService={
            ({
              async fetchToken() {
                return UserToken.fromFake();
              },
              async isLoggedIn() {
                return true;
              },
              async getUserProfile() {
                return UserProfile.fromFake();
              },
              getToken() {
                return UserToken.fromFake();
              },
            } as unknown) as AuthService
          }
        >
          {children}
        </AuthProvider>
      ),
    });
    await act(async () => {
      result.current.handleLoginCallback('');
      await waitForNextUpdate();
    });
    expect(await result.current.checkIsAuthenticated()).toBe(true);
  });
  test('logout calls the auth service logout', async () => {
    const clearSession = jest.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children: React.ReactChild }) => {
        return (
          <AuthProvider
            authService={({ clearSession } as unknown) as AuthService}
          >
            {children}
          </AuthProvider>
        );
      },
    });
    await act(async () => {
      result.current.logout();
    });
    expect(clearSession).toHaveBeenCalled();
  });
});
