import type { components } from '../api/schema';

type Money = components['schemas']['Money'];

/**
 * Formats money for display using Intl.NumberFormat.
 *
 * IMPORTANT: This is the ONLY function that converts money to text.
 * Never use `Number(amount)` outside of this function.
 *
 * @param m - Money object with amount (decimal string) and currency
 * @param locale - Locale for formatting (default: 'sr-RS')
 * @returns Formatted money string (e.g., "1.499,00 RSD")
 */
export function formatMoney(m: Money, locale = 'sr-RS'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: m.currency,
  }).format(Number(m.amount));
}
