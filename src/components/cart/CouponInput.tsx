import { useState } from 'react';
import { Button } from '../common/Button';
import { useT } from '../../hooks/useT';
import { errorKey } from '../../lib/errors';

type CouponInputProps = {
  /** Code already applied to the cart, if any. */
  appliedCode: string | null;
  onApply: (code: string) => void;
  onRemove: () => void;
  pending: boolean;
  error: unknown;
};

export function CouponInput({ appliedCode, onApply, onRemove, pending, error }: CouponInputProps) {
  const { t } = useT();
  const [code, setCode] = useState('');

  if (appliedCode) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-900">
          {t('cart.coupon.applied', { code: appliedCode })}
        </p>
        <button
          type="button"
          onClick={onRemove}
          disabled={pending}
          className="text-sm text-neutral-700 underline underline-offset-4 hover:text-neutral-900 disabled:opacity-40"
        >
          {t('cart.coupon.remove')}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (code.trim()) onApply(code);
      }}
    >
      <label htmlFor="coupon" className="text-sm text-neutral-700">
        {t('cart.coupon.label')}
      </label>

      <div className="mt-2 flex gap-2">
        <input
          id="coupon"
          name="coupon"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'coupon-error' : undefined}
          className="min-w-0 flex-1 rounded-sm border border-neutral-900/20 bg-neutral-50 px-3 py-2 text-sm text-neutral-900"
        />
        <Button type="submit" variant="outline" disabled={pending || !code.trim()}>
          {t('cart.coupon.apply')}
        </Button>
      </div>

      {error != null && (
        <p id="coupon-error" role="alert" className="mt-2 text-sm text-danger">
          {t(errorKey(error))}
        </p>
      )}
    </form>
  );
}
