import { Link, useParams } from 'react-router-dom';
import { ApiError } from '../api/errors';
import { Container } from '../components/layout/Container';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Button, LinkButton } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { LessonList } from '../components/player/LessonList';
import { useCart } from '../hooks/useCart';
import { useProduct } from '../hooks/useProduct';
import { useT } from '../hooks/useT';
import { accessLabel } from '../lib/access';
import { areaBackground } from '../lib/areaColor';
import { errorKey } from '../lib/errors';
import { splitDuration } from '../lib/date';
import { areaKey, examPrepKey, gradeKey, productTypeKey } from '../lib/enums';
import { formatMoney } from '../lib/money';
import { routes } from '../lib/routes';

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-sm border border-neutral-900/15 px-2 py-0.5 text-xs text-neutral-700">
      {children}
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <Skeleton className="aspect-video" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
      <Skeleton className="h-56 w-full" />
    </div>
  );
}

export function CourseDetailPage() {
  const { slug = '' } = useParams();
  const { t, locale } = useT();
  const { data: product, isPending, error, refetch } = useProduct(slug);
  const { add } = useCart();

  if (isPending) {
    return (
      <Container className="py-8 sm:py-12">
        <DetailSkeleton />
      </Container>
    );
  }

  // A missing slug is not a failure to retry — it is a page that does not exist.
  if (error) {
    const notFound = error instanceof ApiError && error.status === 404;

    return (
      <Container className="py-8 sm:py-12">
        {notFound ? (
          <EmptyState
            title={t('course.notFound.title')}
            description={t('course.notFound.description')}
            action={<LinkButton to={routes.catalog()}>{t('course.notFound.action')}</LinkButton>}
          />
        ) : (
          <ErrorState
            title={t('course.error.title')}
            description={t('course.error.description')}
            onRetry={() => void refetch()}
          />
        )}
      </Container>
    );
  }

  const area = product.areas?.[0];
  const access = accessLabel(product, locale);
  const duration = product.totalDurationSec ? splitDuration(product.totalDurationSec) : null;
  const firstLesson = product.lessons?.[0];

  return (
    <Container className="py-8 sm:py-12">
      <div className="grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          {/* The area is a tinted tag rather than a cover-sized block: it is the
              one place the pastel appears on this page, and it carries a label,
              not an image. Not aria-hidden — the area is named nowhere else.
              TODO: the cover image and the free-preview player go above this. */}
          {area && (
            <p
              className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-medium tracking-wide text-neutral-700 uppercase ${areaBackground(area)}`}
            >
              {t(areaKey(area))}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1">
            <Badge>{t(productTypeKey(product.type))}</Badge>
            {product.examPrep && <Badge>{t(examPrepKey(product.examPrep))}</Badge>}
            {product.grades?.map((grade) => <Badge key={grade}>{t(gradeKey(grade))}</Badge>)}
          </div>

          <h1 className="mt-3">{product.title}</h1>

          {product.shortDescription && (
            <p className="mt-4 max-w-prose text-neutral-700">{product.shortDescription}</p>
          )}

          {/* TODO: description is Markdown in the contract; rendered as plain
              paragraphs until we agree on a renderer (new dependency). */}
          {product.description && (
            <div className="mt-6 max-w-prose whitespace-pre-line text-neutral-700">
              {product.description}
            </div>
          )}

          {product.whatYouWillLearn && product.whatYouWillLearn.length > 0 && (
            <section className="mt-10">
              <h2>{t('course.whatYouWillLearn')}</h2>
              <ul className="mt-4 max-w-prose list-disc pl-5 text-neutral-700 marker:text-neutral-500">
                {product.whatYouWillLearn.map((item) => (
                  <li key={item} className="mt-1">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {product.lessons && product.lessons.length > 0 && (
            <section className="mt-10">
              <h2>{t('course.lessons')}</h2>
              <p className="mt-2 text-sm text-neutral-700">
                {t('course.lessonsNote', { count: product.lessons.length })}
              </p>
              <div className="mt-4">
                <LessonList
                  lessons={product.lessons}
                  slug={product.slug}
                  owned={product.owned === true}
                />
              </div>
            </section>
          )}

          {product.includedProducts && product.includedProducts.length > 0 && (
            <section className="mt-10">
              <h2>{t('course.included')}</h2>
              <div className="mt-4">
                <ProductGrid products={product.includedProducts} />
              </div>
            </section>
          )}

          {product.requirements && product.requirements.length > 0 && (
            <section className="mt-10">
              <h2>{t('course.requirements')}</h2>
              <ul className="mt-4 max-w-prose list-disc pl-5 text-neutral-700 marker:text-neutral-500">
                {product.requirements.map((item) => (
                  <li key={item} className="mt-1">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {product.instructors && product.instructors.length > 0 && (
            <section className="mt-10">
              <h2>{t('course.instructors')}</h2>
              <ul className="mt-4 flex flex-col gap-4">
                {product.instructors.map((instructor) => (
                  <li key={instructor.id} className="flex items-start gap-3">
                    {/* TODO: photoUrl once photos exist; initials until then. */}
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-3 text-sm font-medium text-neutral-900"
                    >
                      {instructor.fullName
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <div>
                      <p className="font-medium text-neutral-900">{instructor.fullName}</p>
                      {instructor.title && (
                        <p className="text-sm text-neutral-700">{instructor.title}</p>
                      )}
                      {instructor.shortBio && (
                        <p className="mt-1 max-w-prose text-sm text-neutral-700">
                          {instructor.shortBio}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="rounded-md border border-neutral-900/12 bg-neutral-100 p-6 lg:sticky lg:top-8">
          {product.owned ? (
            <>
              <p className="font-medium text-success">{t('product.owned')}</p>
              <div className="mt-4">
                <LinkButton
                  to={
                    firstLesson
                      ? routes.classroom(product.slug, firstLesson.videoId)
                      : routes.library()
                  }
                >
                  {t('course.continue')}
                </LinkButton>
              </div>
            </>
          ) : (
            <>
              <p className="flex items-baseline gap-2">
                <span className="price font-display text-3xl font-semibold text-neutral-900">
                  {formatMoney(product.price, locale)}
                </span>
                {product.compareAtPrice && (
                  <s className="price text-neutral-700">
                    {formatMoney(product.compareAtPrice, locale)}
                  </s>
                )}
              </p>

              <div className="mt-4">
                <Button
                  onClick={() => add.mutate(product.id)}
                  disabled={add.isPending}
                  className="w-full"
                >
                  {add.isPending ? t('course.adding') : t('course.addToCart')}
                </Button>
              </div>

              {add.isSuccess && (
                <p role="status" className="mt-3 text-sm text-neutral-900">
                  {t('course.added')}{' '}
                  <Link to={routes.cart()} className="underline underline-offset-4">
                    {t('course.toCart')}
                  </Link>
                </p>
              )}

              {/* 409 ALREADY_OWNED is not a failure to retry — it means the
                  reader can go and watch it (spec 4.5). */}
              {add.isError && (
                <p role="alert" className="mt-3 text-sm text-danger">
                  {t(errorKey(add.error))}{' '}
                  {add.error instanceof ApiError && add.error.status === 409 && (
                    <Link to={routes.library()} className="underline underline-offset-4">
                      {t('course.toLibrary')}
                    </Link>
                  )}
                </p>
              )}
            </>
          )}

          <dl className="mt-6 flex flex-col gap-3 border-t border-neutral-900/12 pt-6 text-sm">
            {access && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-700">{t('course.access')}</dt>
                <dd className="text-right text-neutral-900">{t(access.key, access.params)}</dd>
              </div>
            )}
            {product.lessonCount && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-700">{t('course.lessonCount')}</dt>
                <dd className="text-neutral-900">
                  {t('product.lessons', { count: product.lessonCount })}
                </dd>
              </div>
            )}
            {duration && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-700">{t('course.duration')}</dt>
                <dd className="text-neutral-900">
                  {duration.hours > 0
                    ? t('product.durationHours', duration)
                    : t('product.durationMinutes', duration)}
                </dd>
              </div>
            )}
            {product.schoolYear && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-700">{t('course.schoolYear')}</dt>
                <dd className="text-neutral-900">{product.schoolYear}</dd>
              </div>
            )}
          </dl>
        </aside>
      </div>
    </Container>
  );
}
