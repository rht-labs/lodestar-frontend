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
            async getToken() {
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
});
