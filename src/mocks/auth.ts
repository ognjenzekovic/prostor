import type { components } from '../api/schema';
import { ApiError } from '../api/errors';

/**
 * Accounts for the mock backend.
 *
 * Passwords sit here in plain text on purpose: this module stands in for a
 * server that does not exist yet, and nothing here ever ships — the production
 * build drops the whole mocks/ chunk.
 *
 * The real API identifies the caller from the Authorization header. The mock
 * cannot see headers, so it reads the same token http.ts would have sent.
 */

type User = components['schemas']['User'];
type AuthResponse = components['schemas']['AuthResponse'];
type RegisterRequest = components['schemas']['RegisterRequest'];
type LoginRequest = components['schemas']['LoginRequest'];

const ACCESS_KEY = 'accessToken';

/** Short TTL makes the 401 -> refresh path testable: VITE_MOCK_TOKEN_TTL_SEC=10 */
const TOKEN_TTL_SEC = Number(import.meta.env.VITE_MOCK_TOKEN_TTL_SEC) || 900;

type Account = {
  user: User;
  password: string;
  /** Product slugs this account has an active entitlement for. */
  entitlements: string[];
};

const ACCOUNTS: Account[] = [
  {
    user: {
      id: '9a4e0c10-0000-4000-8000-000000000001',
      email: 'ucenik@primer.rs',
      firstName: 'Milica',
      lastName: 'Jovanović',
      role: 'STUDENT',
      emailVerified: true,
      script: 'lat',
      createdAt: '2026-02-11T10:00:00Z',
    },
    password: 'prostor123',
    entitlements: ['pravopis-najcesce-greske'],
  },
  {
    user: {
      id: '9a4e0c10-0000-4000-8000-000000000002',
      email: 'admin@primer.rs',
      firstName: 'Marija',
      lastName: 'Petrović',
      role: 'ADMIN',
      emailVerified: true,
      script: 'lat',
      createdAt: '2026-01-05T10:00:00Z',
    },
    password: 'prostor123',
    entitlements: [],
  },
];

/** Accounts created during the session; lost on reload, like the rest of the mock. */
const REGISTERED: Account[] = [];

function allAccounts(): Account[] {
  return [...ACCOUNTS, ...REGISTERED];
}

/**
 * Tokens are readable on purpose — `mock.<userId>.<expiryMillis>` — so the
 * mock can identify and expire them without any crypto.
 */
function issue(userId: string, ttlSec: number): string {
  return `mock.${userId}.${Date.now() + ttlSec * 1000}`;
}

function parse(token: string): { userId: string; expiresAt: number } | null {
  const [prefix, userId, expiresAt] = token.split('.');
  if (prefix !== 'mock' || !userId || !expiresAt) return null;
  return { userId, expiresAt: Number(expiresAt) };
}

function respond(account: Account): AuthResponse {
  return {
    accessToken: issue(account.user.id, TOKEN_TTL_SEC),
    // Refresh lives far longer, so it outlives the access token it renews.
    refreshToken: issue(account.user.id, 30 * 24 * 3600),
    expiresIn: TOKEN_TTL_SEC,
    user: account.user,
  };
}

/**
 * The caller behind the current access token.
 *
 * @returns the account, or null when signed out
 * @throws ApiError - 401 TOKEN_EXPIRED, which http.ts answers by refreshing
 */
export function currentAccount(): Account | null {
  const token = sessionStorage.getItem(ACCESS_KEY);
  if (!token) return null;

  const parsed = parse(token);
  if (!parsed) return null;

  if (Date.now() > parsed.expiresAt) {
    throw new ApiError(401, 'TOKEN_EXPIRED', 'Pristupni token je istekao');
  }

  return allAccounts().find((account) => account.user.id === parsed.userId) ?? null;
}

/** Product slugs the current caller owns; empty when signed out. */
export function currentEntitlements(): string[] {
  try {
    return currentAccount()?.entitlements ?? [];
  } catch {
    // An expired token is not an entitlement question — treat as signed out
    // here and let the endpoint that needs auth raise the 401.
    return [];
  }
}

export function login(body: LoginRequest): AuthResponse {
  const account = allAccounts().find(
    (candidate) =>
      candidate.user.email.toLowerCase() === body.email.trim().toLowerCase() &&
      candidate.password === body.password
  );

  if (!account) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Pogresan email ili lozinka');
  }

  return respond(account);
}

export function register(body: RegisterRequest): AuthResponse {
  const email = body.email.trim().toLowerCase();

  if (allAccounts().some((account) => account.user.email.toLowerCase() === email)) {
    throw new ApiError(409, 'EMAIL_TAKEN', 'Nalog sa ovim email-om vec postoji');
  }

  const account: Account = {
    user: {
      id: `9a4e0c10-0000-4000-8000-${String(allAccounts().length + 1).padStart(12, '0')}`,
      email,
      firstName: body.firstName,
      lastName: body.lastName,
      role: 'STUDENT',
      // The contract says a verification email is sent, so a fresh account
      // is not verified yet.
      emailVerified: false,
      script: body.script ?? 'lat',
      createdAt: new Date().toISOString(),
    },
    password: body.password,
    entitlements: [],
  };

  REGISTERED.push(account);
  return respond(account);
}

export function refresh(refreshToken: string): AuthResponse {
  const parsed = parse(refreshToken);

  if (!parsed || Date.now() > parsed.expiresAt) {
    throw new ApiError(401, 'TOKEN_EXPIRED', 'Refresh token je istekao');
  }

  const account = allAccounts().find((candidate) => candidate.user.id === parsed.userId);

  if (!account) {
    throw new ApiError(401, 'TOKEN_EXPIRED', 'Nalog ne postoji');
  }

  return respond(account);
}

export function me(): User {
  const account = currentAccount();

  if (!account) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Niste prijavljeni');
  }

  return account.user;
}
