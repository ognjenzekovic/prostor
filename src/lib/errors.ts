import { ApiError } from '../api/errors';

/**
 * Error code -> i18n key (spec 4.7).
 *
 * The allowlist is deliberate: an unmapped code falls back to a general
 * message instead of printing `errors.SOMETHING_NEW` at the user, which is
 * what happens if the key is built from the code blindly.
 */
const TRANSLATED = new Set([
  'ALREADY_OWNED',
  'COUPON_EXPIRED',
  'COUPON_INVALID',
  'PRODUCT_NOT_FOUND',
  'ACCESS_EXPIRED',
  'NO_ACCESS',
  'NETWORK_ERROR',
  'EMAIL_TAKEN',
  'INVALID_CREDENTIALS',
  'TOKEN_EXPIRED',
  'UNAUTHORIZED',
]);

/**
 * @param error - Anything thrown by the api layer
 * @returns i18n key for a message the reader can act on
 */
export function errorKey(error: unknown): string {
  if (error instanceof ApiError && TRANSLATED.has(error.code)) {
    return `errors.${error.code}`;
  }

  return 'errors.UNKNOWN';
}
