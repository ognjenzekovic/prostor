import { Container } from '../components/layout/Container';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LinkButton } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { CartLine } from '../components/cart/CartLine';
import { CouponInput } from '../components/cart/CouponInput';
import { useCart } from '../hooks/useCart';
import { useT } from '../hooks/useT';
import { formatMoney } from '../lib/money';
import { routes } from '../lib/routes';

function CartSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1].map((index) => (
        <Skeleton key={index} className="h-20" />
      ))}
      <Skeleton className="mt-4 h-32" />
    </div>
  );
}

export function CartPage() {
  const { t, locale } = useT();
  const { data: cart, isPending, isError, refetch, remove, coupon, clearCoupon, clear } = useCart();

  if (isPending) {
    return (
      <Container className="py-8 sm:py-12">
        <h1>{t('cart.title')}</h1>
        <div className="mt-8">
          <CartSkeleton />
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-8 sm:py-12">
        <h1>{t('cart.title')}</h1>
        <div className="mt-8">
          <ErrorState
            title={t('cart.error.title')}
            description={t('cart.error.description')}
            onRetry={() => void refetch()}
          />
        </div>
      </Container>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Container className="py-8 sm:py-12">
        <h1>{t('cart.title')}</h1>
        <div className="mt-8">
          <EmptyState
            title={t('cart.empty.title')}
            description={t('cart.empty.description')}
            action={<LinkButton to={routes.catalog()}>{t('cart.empty.action')}</LinkButton>}
          />
        </div>
      </Container>
    );
  }

  // Shown only when there is something to show — a "-0,00 RSD" line reads as a
  // bug, and the server sends zero whenever no coupon applies.
  const hasDiscount = Number(cart.discount.amount) > 0;

  return (
    <Container className="py-8 sm:py-12">
      <h1>{t('cart.title')}</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm text-neutral-700">
              {t('cart.itemCount', { count: cart.items.length })}
            </p>
            <button
              type="button"
              onClick={() => clear.mutate()}
              disabled={clear.isPending}
              className="text-sm text-neutral-700 underline underline-offset-4 hover:text-neutral-900 disabled:opacity-40"
            >
              {t('cart.clearAll')}
            </button>
          </div>

          <ul className="mt-3 divide-y divide-neutral-900/12 border-y border-neutral-900/12">
            {cart.items.map((item) => (
              <CartLine
                key={item.productId}
                item={item}
                onRemove={(productId) => remove.mutate(productId)}
                removing={remove.isPending}
              />
            ))}
          </ul>
        </div>

        <aside className="rounded-md border border-neutral-900/12 bg-neutral-100 p-6">
          <CouponInput
            appliedCode={cart.couponCode ?? null}
            onApply={(code) => coupon.mutate(code)}
            onRemove={() => clearCoupon.mutate()}
            pending={coupon.isPending || clearCoupon.isPending}
            error={coupon.error}
          />

          {/* Totals come from the server, never summed here (spec 4.5a). */}
          <dl className="mt-6 flex flex-col gap-2 border-t border-neutral-900/12 pt-6 text-sm">
            {hasDiscount && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-700">{t('cart.discount')}</dt>
                <dd className="price text-success">−{formatMoney(cart.discount, locale)}</dd>
              </div>
            )}

            <div className={`flex justify-between gap-4 ${hasDiscount ? 'mt-2 border-t border-neutral-900/12 pt-4' : ''}`}>
              <dt className="font-medium text-neutral-900">{t('cart.total')}</dt>
              <dd className="price font-display text-xl font-semibold text-neutral-900">
                {formatMoney(cart.total, locale)}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <LinkButton to={routes.checkout()} className="w-full">
              {t('cart.checkout')}
            </LinkButton>
          </div>

          <p className="mt-3 text-sm text-neutral-700">{t('cart.termsNote')}</p>
        </aside>
      </div>
    </Container>
  );
}
