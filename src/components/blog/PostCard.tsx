import { Link } from 'react-router-dom';
import type { components } from '../../api/schema';
import { Skeleton } from '../common/Skeleton';
import { useT } from '../../hooks/useT';
import { areaBackground } from '../../lib/areaColor';
import { formatDate } from '../../lib/date';
import { areaKey } from '../../lib/enums';
import { routes } from '../../lib/routes';

type BlogPostSummary = components['schemas']['BlogPostSummary'];

export function PostCard({ post }: { post: BlogPostSummary }) {
  const { t, locale } = useT();
  const area = post.areas?.[0];

  return (
    <article className="relative flex flex-col overflow-hidden rounded-md border border-neutral-900/12 bg-neutral-100">
      <div className={`h-2 ${areaBackground(area)}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs tracking-wide text-neutral-700 uppercase">
          {area ? t(areaKey(area)) : ''}
        </p>

        <h3 className="text-lg">
          <Link
            to={routes.post(post.slug)}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="line-clamp-3 text-sm text-neutral-700">{post.excerpt}</p>
        )}

        <p className="mt-auto pt-3 text-sm text-neutral-700">
          {[
            formatDate(post.publishedAt, locale),
            post.readingMinutes ? t('blog.readingMinutes', { count: post.readingMinutes }) : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-neutral-900/12 bg-neutral-100">
      <Skeleton className="h-2 rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
