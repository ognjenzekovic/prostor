import type { components } from '../api/schema';
import { formatDate } from './date';

type ProductSummary = components['schemas']['ProductSummary'];

/** An i18n key plus its interpolation values — never a finished sentence. */
export type Label = { key: string; params?: Record<string, string | number> };

/**
 * How long access lasts, as shown in the catalog (spec 4.6a).
 *
 * Three modes, three different sentences — flattening them into one ("access
 * included") throws away the only thing a buyer wants to know before paying.
 *
 * @param product - product whose accessMode drives the wording
 * @param locale - BCP 47 locale, needed to format the UNTIL_DATE date
 */
export function accessLabel(product: ProductSummary, locale: string): Label | null {
  switch (product.accessMode) {
    case 'LIFETIME':
      return { key: 'access.lifetime' };

    case 'DAYS':
      return product.accessDurationDays
        ? { key: 'access.days', params: { days: product.accessDurationDays } }
        : null;

    case 'UNTIL_DATE':
      return product.accessUntil
        ? { key: 'access.untilDate', params: { date: formatDate(product.accessUntil, locale) } }
        : null;

    default:
      return null;
  }
}
