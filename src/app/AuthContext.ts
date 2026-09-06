import { createContext, useContext } from 'react';
import type { components } from '../api/schema';

type User = components['schemas']['User'];
type LoginRequest = components['schemas']['LoginRequest'];
type RegisterRequest = components['schemas']['RegisterRequest'];

export type AuthContextValue = {
  user: User | null;
  /** True while the stored session is being verified on first load. */
  loading: boolean;
  signIn: (body: LoginRequest) => Promise<void>;
  signUp: (body: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

/** Current user and the actions that change the session. */
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return value;
}
