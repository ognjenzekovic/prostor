import type { components } from './schema';
import { apiGet, apiPost } from './http';

type AuthResponse = components['schemas']['AuthResponse'];
type LoginRequest = components['schemas']['LoginRequest'];
type RegisterRequest = components['schemas']['RegisterRequest'];
type User = components['schemas']['User'];

/**
 * @throws ApiError - 401 INVALID_CREDENTIALS on a wrong email or password
 */
export async function login(body: LoginRequest): Promise<AuthResponse> {
  return apiPost<AuthResponse>('/auth/login', body);
}

/**
 * @throws ApiError - 409 EMAIL_TAKEN, or 400 with per-field errors
 */
export async function register(body: RegisterRequest): Promise<AuthResponse> {
  return apiPost<AuthResponse>('/auth/register', body);
}

export async function logout(refreshToken: string): Promise<void> {
  return apiPost<void>('/auth/logout', { refreshToken });
}

export async function getMe(): Promise<User> {
  return apiGet<User>('/auth/me');
}

/**
 * Always resolves, even for an address with no account — the contract answers
 * 204 either way so the endpoint cannot be used to enumerate accounts.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  return apiPost<void>('/auth/password-reset/request', { email });
}
