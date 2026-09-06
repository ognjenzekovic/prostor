import { Link } from 'react-router-dom';
import type { components } from '../../api/schema';
import { Skeleton } from '../common/Skeleton';
import { useT } from '../../hooks/useT';
import { accessLabel } from '../../lib/access';
import { areaBackground } from '../../lib/areaColor';
import { splitDuration } from '../../lib/date';
import { areaKey, examPrepKey, gradeKey, productTypeKey } from '../../lib/enums';
import { formatMoney } from '../../lib/money';
import { routes } from '../../lib/routes';

type ProductSummary = components['schemas']['ProductSummary'];

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-sm border border-neutral-900/15 px-2 py-0.5 text-xs text-neutral-700">
      {children}
    </span>
  );
}

export function ProductCard({ product }: { product: ProductSummary }) {
  const { t, locale } = useT();
  const area = product.areas?.[0];
  const access = accessLabel(product, locale);
  const duration = product.totalDurationSec ? splitDuration(product.totalDurationSec) : null;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-md border border-neutral-900/12 bg-neutral-100">
      {/* Cover stands in for an image that does not exist yet: the area pastel
          already tells the reader what the course is about (docs/06 §6.2).
          TODO: real <img> with width/height and loading="lazy" (spec 4.9). */}
      <div
        className={`flex aspect-video items-end p-4 ${areaBackground(area)}`}
        aria-hidden="true"
      >
        {area && (
          <span className="text-xs font-medium tracking-wide text-neutral-700 uppercase">
            {t(areaKey(area))}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1">
          <Badge>{t(productTypeKey(product.type))}</Badge>
          {product.examPrep && <Badge>{t(examPrepKey(product.examPrep))}</Badge>}
          {product.grades?.map((grade) => <Badge key={grade}>{t(gradeKey(grade))}</Badge>)}
        </div>

        <h3 className="text-lg">
          {/* Stretched link: one link in the accessibility tree, whole card
              tappable — which is what matters at 360px. */}
          <Link
            to={routes.course(product.slug)}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {product.title}
          </Link>
        </h3>

        {product.shortDescription && (
          <p className="line-clamp-2 text-sm text-neutral-700">{product.shortDescription}</p>
        )}

        <p className="text-sm text-neutral-700">
          {[
            product.lessonCount ? t('product.lessons', { count: product.lessonCount }) : null,
            duration
              ? duration.hours > 0
                ? t('product.durationHours', duration)
                : t('product.durationMinutes', duration)
              : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>

        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-2 border-t border-neutral-900/12 pt-3">
          {product.owned ? (
            <span className="text-sm font-medium text-success">{t('product.owned')}</span>
          ) : (
            <p className="flex items-baseline gap-2">
              <span className="price text-lg font-semibold text-neutral-900">
                {formatMoney(product.price, locale)}
              </span>
              {product.compareAtPrice && (
                <s className="price text-sm text-neutral-700">
                  {formatMoney(product.compareAtPrice, locale)}
                </s>
              )}
            </p>
          )}

          {access && <span className="text-sm text-neutral-700">{t(access.key, access.params)}</span>}
        </div>
      </div>
    </article>
  );
}

/** Same shape as the card above, so the grid does not jump when data lands. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-neutral-900/12 bg-neutral-100">
      <Skeleton className="aspect-video rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-3 h-6 w-32" />
      </div>
    </div>
  );
}
