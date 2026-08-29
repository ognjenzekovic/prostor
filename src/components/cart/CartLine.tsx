import { Link } from 'react-router-dom';
import type { components } from '../../api/schema';
import { useT } from '../../hooks/useT';
import { accessLabel } from '../../lib/access';
import { formatMoney } from '../../lib/money';
import { productTypeKey } from '../../lib/enums';
import { routes } from '../../lib/routes';

type CartItem = components['schemas']['CartItem'];

type CartLineProps = {
  item: CartItem;
  onRemove: (productId: string) => void;
  removing: boolean;
};

export function CartLine({ item, onRemove, removing }: CartLineProps) {
  const { t, locale } = useT();
  // accessLabel reads the same fields on CartItem as on a product summary.
  const access = accessLabel(item, locale);

  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-lg">
          {item.slug ? (
            <Link to={routes.course(item.slug)}>{item.title}</Link>
          ) : (
            item.title
          )}
        </p>
        <p className="mt-1 text-sm text-neutral-700">
          {[item.type ? t(productTypeKey(item.type)) : null, access ? t(access.key, access.params) : null]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      <p className="price font-semibold text-neutral-900">{formatMoney(item.price, locale)}</p>

      <button
        type="button"
        onClick={() => onRemove(item.productId)}
        disabled={removing}
        className="text-sm text-neutral-700 underline underline-offset-4 hover:text-neutral-900 disabled:opacity-40"
      >
        {t('cart.remove')}
      </button>
    </li>
  );
}
