import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { LinkButton } from '../components/common/Button';
import { ErrorState } from '../components/common/ErrorState';
import { Skeleton } from '../components/common/Skeleton';
import { ProductGrid, ProductGridSkeleton } from '../components/catalog/ProductGrid';
import { PostCard, PostCardSkeleton } from '../components/blog/PostCard';
import { HeroScene } from '../components/home/HeroScene';
import { Shelf } from '../components/home/Shelf';
import { Acrostic } from '../components/home/Acrostic';
import { useProducts } from '../hooks/useProducts';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useInstructors } from '../hooks/useInstructors';
import { useT } from '../hooks/useT';
import { routes } from '../lib/routes';

/**
 * Landing.
 *
 * The page is the client's picture end to end: the lock opens into a bookcase
 * that carries the name, and everything under it stands on shelves — courses,
 * then writing, then the people behind them.
 */
export function HomePage() {
  const { t } = useT();

  const products = useProducts({ sort: 'popular', size: 6 });
  const posts = useBlogPosts({ size: 3 });
  const instructors = useInstructors();

  return (
    <Container className="py-8 sm:py-12">
      <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h1>{t('home.hero.title')}</h1>
          <p className="mt-4 max-w-prose text-lg text-neutral-700">{t('home.hero.subtitle')}</p>
          <p className="mt-4 max-w-prose text-neutral-700">{t('home.hero.note')}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton to={routes.catalog()}>{t('home.hero.primary')}</LinkButton>
            <LinkButton to={routes.examPrepMalaMatura()} variant="outline">
              {t('home.hero.secondary')}
            </LinkButton>
          </div>
        </div>

        <HeroScene className="mx-auto max-w-sm" />
      </section>

      <Shelf
        title={t('home.courses.title')}
        action={
          <Link to={routes.catalog()} className="text-sm text-neutral-700 hover:text-neutral-900">
            {t('home.courses.all')}
          </Link>
        }
      >
        {products.isPending ? (
          <ProductGridSkeleton count={3} />
        ) : products.isError ? (
          <ErrorState
            title={t('catalog.error.title')}
            description={t('catalog.error.description')}
            onRetry={() => void products.refetch()}
          />
        ) : (
          <ProductGrid products={products.data.content} />
        )}
      </Shelf>

      <Shelf
        title={t('home.blog.title')}
        action={
          <Link to={routes.blog()} className="text-sm text-neutral-700 hover:text-neutral-900">
            {t('home.blog.all')}
          </Link>
        }
      >
        {posts.isPending ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : posts.isError ? (
          <ErrorState
            title={t('home.blog.error.title')}
            description={t('home.blog.error.description')}
            onRetry={() => void posts.refetch()}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.data.content?.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </Shelf>

      <Acrostic />

      <section className="mt-10">
        <h2 className="sr-only">{t('home.instructors.title')}</h2>

        {instructors.isPending ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-24" />
            ))}
          </div>
        ) : instructors.isError ? (
          <ErrorState
            title={t('home.instructors.error.title')}
            description={t('home.instructors.error.description')}
            onRetry={() => void instructors.refetch()}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-3">
            {instructors.data.map((instructor) => (
              <li
                key={instructor.id}
                className="rounded-md border border-neutral-900/12 bg-neutral-100 p-4"
              >
                <div className="flex items-center gap-3">
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
                    <p className="font-medium text-neutral-900">
                      <Link to={routes.instructor(instructor.slug)}>{instructor.fullName}</Link>
                    </p>
                    {instructor.title && (
                      <p className="text-sm text-neutral-700">{instructor.title}</p>
                    )}
                  </div>
                </div>
                {instructor.shortBio && (
                  <p className="mt-3 text-sm text-neutral-700">{instructor.shortBio}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Text left, action right, on the same edges as the shelves above — the
          rest of the page is left-aligned, so a centred block reads as adrift. */}
      <section className="mt-16 flex flex-col gap-6 rounded-md border border-neutral-900/12 bg-neutral-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2>{t('home.cta.title')}</h2>
          <p className="mt-3 max-w-prose text-neutral-700">{t('home.cta.description')}</p>
        </div>

        <LinkButton to={routes.catalog()} className="shrink-0 self-start sm:self-auto">
          {t('home.cta.action')}
        </LinkButton>
      </section>
    </Container>
  );
}
