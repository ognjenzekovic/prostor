import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { components } from '../api/schema';
import * as authApi from '../api/auth';
import { clearTokens, getAccessToken, getRefreshToken, storeTokens } from '../api/tokens';
import { AuthContext } from './AuthContext';

type User = components['schemas']['User'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => getAccessToken() !== null);
  const queryClient = useQueryClient();

  /**
   * A stored token is not proof of a session — it may have expired while the
   * tab was closed — so it is exchanged for the user before anything renders
   * as signed in.
   */
  useEffect(() => {
    if (!getAccessToken()) return;

    let cancelled = false;

    authApi
      .getMe()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => {
        clearTokens();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Signing in or out changes what every query means: `owned`, the cart and
   * the library all answer per caller. Clearing the cache is the only honest
   * response — keeping it would show the previous user's data.
   */
  const resetCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  const signIn = useCallback(
    async (body: components['schemas']['LoginRequest']) => {
      const session = await authApi.login(body);
      storeTokens(session.accessToken, session.refreshToken);
      setUser(session.user);
      resetCache();
    },
    [resetCache]
  );

  const signUp = useCallback(
    async (body: components['schemas']['RegisterRequest']) => {
      const session = await authApi.register(body);
      storeTokens(session.accessToken, session.refreshToken);
      setUser(session.user);
      resetCache();
    },
    [resetCache]
  );

  const signOut = useCallback(async () => {
    const refreshToken = getRefreshToken();

    // The local session ends either way; a failed call only leaves a refresh
    // token alive on the server, which is the server's problem to expire.
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => undefined);
    }

    clearTokens();
    setUser(null);
    resetCache();
  }, [resetCache]);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
