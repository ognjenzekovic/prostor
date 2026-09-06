import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * The two button shapes the site uses.
 *
 * `primary` is ink on paper (14.3:1). Brass is held back for now, so the
 * strongest thing on a screen is contrast rather than colour — which also
 * keeps the "one primary action per screen" rule (docs/06 §6.7) readable.
 *
 * Buttons that navigate render as links, so middle-click and "open in new tab"
 * keep working: use LinkButton, not onClick + navigate.
 */
type Variant = 'primary' | 'outline';

const BASE = 'inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-neutral-900 font-medium text-neutral-50 hover:bg-neutral-700',
  outline: 'border border-neutral-900/15 text-neutral-700 hover:text-neutral-900',
};

function classes(variant: Variant, className: string): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`${classes(variant, className)} disabled:opacity-40`}
      {...rest}
    />
  );
}

type LinkButtonProps = {
  to: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

export function LinkButton({ to, children, variant = 'primary', className = '' }: LinkButtonProps) {
  return (
    <Link to={to} className={classes(variant, className)}>
      {children}
    </Link>
  );
}
