import type { ElementType, ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  /** Renders as <div> by default; pass 'main', 'header', 'footer' etc. when semantics matter. */
  as?: ElementType;
  className?: string;
};

/**
 * Horizontal page frame: one max width and one gutter for the whole site.
 * Gutter is 16px on phones (design works at 360px) and grows from `sm` up.
 */
export function Container({ children, as: Tag = 'div', className = '' }: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</Tag>
  );
}
