/**
 * Form validation.
 *
 * Rules return an i18n key or null, never a finished sentence, so the message
 * is translated and transliterated like everything else (project rule 9).
 *
 * Deliberately small: the three auth forms need required, email shape, a
 * minimum password length and a checked box. When the admin product form
 * arrives — fifteen fields, conditional on accessMode — this is the point to
 * reach for React Hook Form + Zod instead of growing this file.
 */

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/**
 * ASCII only, the way the large providers actually accept addresses.
 *
 * Internationalised addresses (EAI, `име@пример.рс`) exist on paper but are
 * rejected by most mail systems, so a Serbian address typed in Cyrillic would
 * pass validation here and then never receive the confirmation. Refusing it at
 * the field is the honest outcome.
 *
 * The local part allows `. _ % + -` rather than Gmail's letters-and-dots
 * alone: plus-addressing is a Gmail feature, and underscores are ordinary at
 * other providers. Narrowing it further would reject working addresses.
 */
const EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/** Limits from RFC 5321: the whole address, and the part before the @. */
const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_LENGTH = 64;

export const MIN_PASSWORD_LENGTH = 8;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 60;

/**
 * Characters that appear inside real names.
 *
 * \p{L} covers every script, so Serbian diacritics (č ć ž š đ) and Cyrillic
 * pass without listing them; \p{M} keeps decomposed accents together. Hyphen
 * is required for double surnames (Petrović-Jovanović), space for compound
 * given names (Ana Marija) and particles (van der), and both apostrophe shapes
 * for names like D'Angelo — a typographic quote is what a phone keyboard
 * inserts.
 *
 * Digits are deliberately absent: no name contains one, and allowing them only
 * lets junk through. A full stop is out for the same reason — it is what turns
 * "." into an accepted name.
 */
const NAME_ALLOWED = /^[\p{L}\p{M}'’ -]+$/u;
const LETTER = /\p{L}/gu;

export function required(value: string): string | null {
  return value.trim() ? null : 'validation.required';
}

export function email(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return 'validation.required';
  if (trimmed.length > MAX_EMAIL_LENGTH) return 'validation.email';
  if (!EMAIL.test(trimmed)) return 'validation.email';

  const local = trimmed.slice(0, trimmed.lastIndexOf('@'));

  // A dot may separate parts of the local name but cannot start, end or double
  // it — the same rule Gmail applies when an address is created.
  if (local.length > MAX_LOCAL_LENGTH) return 'validation.email';
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
    return 'validation.email';
  }

  return null;
}

export function password(value: string): string | null {
  if (!value) return 'validation.required';
  return value.length >= MIN_PASSWORD_LENGTH ? null : 'validation.passwordTooShort';
}

/**
 * A given or family name.
 *
 * The length check counts letters, not characters, so "--" and "'" are
 * rejected for the right reason rather than sneaking past a length test.
 */
export function personName(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return 'validation.required';
  if (trimmed.length > MAX_NAME_LENGTH) return 'validation.nameTooLong';
  if (!NAME_ALLOWED.test(trimmed)) return 'validation.nameCharacters';
  if ((trimmed.match(LETTER) ?? []).length < MIN_NAME_LENGTH) return 'validation.nameTooShort';

  return null;
}

export function checked(value: boolean): string | null {
  return value ? null : 'validation.mustAccept';
}

/**
 * Runs a rule per field and drops the fields that passed.
 *
 * @param values - current form values
 * @param rules - one rule per field being validated
 * @returns errors by field; empty means the form may be submitted
 */
export function validate<T extends object>(
  values: T,
  rules: { [K in keyof T]?: (value: T[K]) => string | null }
): FieldErrors<T> {
  const errors: FieldErrors<T> = {};

  for (const key of Object.keys(rules) as Array<keyof T>) {
    const rule = rules[key];
    const error = rule?.(values[key]);
    if (error) errors[key] = error;
  }

  return errors;
}

/**
 * Field errors the server sent back (`Problem.errors[]`), keyed by field.
 *
 * The server is the only side that knows some rules — an address already in
 * use, a password on a breach list — so its messages are shown as they came,
 * already localised by the API.
 */
export function serverFieldErrors<T extends object>(
  errors: Array<{ field?: string; message?: string }> | undefined
): FieldErrors<T> {
  const mapped: FieldErrors<T> = {};

  for (const entry of errors ?? []) {
    if (entry.field && entry.message) {
      mapped[entry.field as keyof T] = entry.message;
    }
  }

  return mapped;
}
