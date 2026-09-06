/**
 * Date and duration formatting. Locale comes from the caller, never from a
 * hardcoded default scattered across components (spec 4.7).
 */

/**
 * Formats an ISO date (YYYY-MM-DD) for display, e.g. "31.08.2027.".
 *
 * @param iso - ISO date string from the API
 * @param locale - BCP 47 locale, e.g. 'sr-RS'
 */
export function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));
}

/**
 * Formats a video duration as hours and minutes, e.g. "2 h 20 min".
 *
 * Returns the parts rather than a sentence so the caller can translate the
 * units; seconds are dropped because catalog cards show course length, not a
 * stopwatch.
 */
export function splitDuration(totalSeconds: number): { hours: number; minutes: number } {
  const totalMinutes = Math.round(totalSeconds / 60);

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}
