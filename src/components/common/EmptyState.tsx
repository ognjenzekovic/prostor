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
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-prose text-neutral-700">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
