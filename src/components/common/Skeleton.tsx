/**
 * Loading placeholder.
 *
 * Always sized by the caller to match the content it stands in for — a
 * skeleton shaped like the page beats a spinner in the middle (spec 4.6).
 * The pulse is disabled by the reduced-motion rule in index.css.
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-sm bg-neutral-100 ${className}`} />;
}
