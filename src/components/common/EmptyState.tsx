import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  /** Exactly one way forward — more than one turns an empty screen into a menu. */
  action?: ReactNode;
};

/**
 * Nothing to show, and that is not an error.
 *
 * This is the first screen the client sees on a demo with no data, so it gets
 * a sentence explaining what would be here, not just a shrug.
 *
 * TODO: the owl belongs here (docs/06.4), once the illustration exists.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-neutral-900/12 bg-neutral-100 px-6 py-12 text-center">
      {/* The heading keeps the page's h2 scale. The measure is wide enough for
          these one-sentence explanations to stay on a single line on desktop;
          text-balance evens out the lines when a narrow screen forces a wrap. */}
      <h2 className="font-display">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-balance text-neutral-700">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
