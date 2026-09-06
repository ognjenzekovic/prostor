import { useState } from 'react';
import { validate, type FieldErrors } from '../lib/validation';

type Rules<T> = { [K in keyof T]?: (value: T[K]) => string | null };

/**
 * Form values plus the two moments a field gets checked.
 *
 * A field is checked when it is left (`checkField`), so the requirement turns
 * red while the reader can still see what they typed, and again on submit
 * (`checkAll`) for anything never touched. It is deliberately not checked on
 * every keystroke: going red halfway through a correct address is nagging.
 */
export function useValidatedForm<T extends object>(initial: T, rules: Rules<T>) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<FieldErrors<T>>({});

  function setValue<K extends keyof T>(key: K, value: T[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));

    // A field that is already red is re-checked on every keystroke, so the
    // complaint disappears the moment it is answered. A field that has not
    // been complained about yet is left alone — that is what keeps typing
    // from going red halfway through a correct answer.
    setErrors((previous) => {
      if (!previous[key]) return previous;
      return { ...previous, [key]: rules[key]?.(value) ?? undefined };
    });
  }

  function checkField<K extends keyof T>(key: K) {
    const message = rules[key]?.(values[key]);
    setErrors((previous) => ({ ...previous, [key]: message ?? undefined }));
  }

  /** @returns true when every rule passes and the form may be submitted */
  function checkAll(): boolean {
    const found = validate(values, rules);
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  return { values, errors, setValue, setErrors, checkField, checkAll };
}
