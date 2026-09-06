import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string;
  /**
   * What the field expects, in plain words. This is the only message the field
   * ever shows for its own rule — grey while being filled in, red once it has
   * been left unsatisfied.
   */
  rule: string;
  /** True once the field has been checked and still does not satisfy the rule. */
  invalid?: boolean;
  /**
   * A message only the server could produce — an address already in use, say.
   * Replaces the rule and is shown whether or not the field has focus.
   */
  error?: string;
};

/**
 * A labelled input with one message.
 *
 * The rule and the error are the same line on purpose: a separate hint and a
 * separate error say the same thing twice and make the reader work out which
 * one applies. Here the requirement appears on focus and simply turns red if
 * it was not met — the text never changes, so there is nothing to re-read.
 *
 * The message stays in the DOM when hidden, only visually, so a screen reader
 * still announces it through `aria-describedby` on focus (spec 4.8).
 */
export function Field({ label, rule, invalid, error, className = '', ...input }: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const [focused, setFocused] = useState(false);

  const failed = Boolean(error) || Boolean(invalid);
  const message = error ?? rule;
  const visible = focused || failed;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-900">
        {label}
      </label>

      <input
        id={id}
        aria-invalid={failed || undefined}
        aria-describedby={messageId}
        onFocus={(event) => {
          setFocused(true);
          input.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          input.onBlur?.(event);
        }}
        className={`mt-2 block w-full rounded-sm border bg-neutral-50 px-3 py-2 text-neutral-900 ${
          failed ? 'border-danger' : 'border-neutral-900/20'
        }`}
        {...input}
      />

      <p
        id={messageId}
        className={
          visible ? `mt-1 text-sm ${failed ? 'text-danger' : 'text-neutral-700'}` : 'sr-only'
        }
      >
        {message}
      </p>
    </div>
  );
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & {
  label: ReactNode;
  error?: string;
};

export function Checkbox({ label, error, className = '', ...input }: CheckboxProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <div className="flex items-start gap-2">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-1 size-4 shrink-0 accent-neutral-900"
          {...input}
        />
        <label htmlFor={id} className="text-sm text-neutral-700">
          {label}
        </label>
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
