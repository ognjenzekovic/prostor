/**
 * Where the tokens live.
 *
 * sessionStorage for phase 1 (project rule 7): it dies with the tab, which
 * costs the user a sign-in per session but keeps the token out of long-lived
 * storage until we decide otherwise.
 *
 * TODO: revisit — the likely answer is a refresh token in an httpOnly cookie
 * and the access token in memory only.
 */
const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_KEY);
}

export function storeTokens(accessToken: string, refreshToken: string): void {
  sessionStorage.setItem(ACCESS_KEY, accessToken);
  sessionStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens(): void {
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}
