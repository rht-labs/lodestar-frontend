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
});
