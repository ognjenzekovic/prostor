import type { ReactNode } from 'react';

type ShelfProps = {
  title: string;
  /** Link or button shown next to the heading, e.g. "all courses". */
  action?: ReactNode;
  children: ReactNode;
};

/**
 * A landing section presented as a shelf: content sits on a board.
 *
 * This carries the hero's metaphor down the page — the bookcase opens, and
 * everything below is what stands on its shelves. The board is structural, not
 * ornament, so it stays a flat bar rather than a drawn plank with grain.
 */
export function Shelf({ title, action, children }: ShelfProps) {
  return (
    <section className="mt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2>{title}</h2>
        {action}
      </div>

      <div className="mt-6">{children}</div>

      <div aria-hidden="true" className="mt-6">
        <div className="h-1.5 rounded-sm bg-neutral-900" />
        <div className="flex justify-between">
          <span className="h-3 w-1.5 rounded-b-sm bg-neutral-900" />
          <span className="h-3 w-1.5 rounded-b-sm bg-neutral-900" />
        </div>
      </div>
    </section>
  );
}
