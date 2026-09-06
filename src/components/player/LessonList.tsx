import { Link } from 'react-router-dom';
import type { components } from '../../api/schema';
import { KeyIcon, type KeyState } from '../common/KeyIcon';
import { useT } from '../../hooks/useT';
import { splitDuration } from '../../lib/date';
import { routes } from '../../lib/routes';

type Lesson = components['schemas']['Lesson'];

type LessonListProps = {
  lessons: Lesson[];
  /** Course slug — needed to build the classroom link. */
  slug: string;
  /** Whether the reader already has access to the whole course. */
  owned: boolean;
};

/** Owned unlocks everything; without it only free preview lessons open. */
function lessonState(lesson: Lesson, owned: boolean): KeyState {
  if (owned) return 'unlocked';
  return lesson.isFreePreview ? 'preview' : 'locked';
}

export function LessonList({ lessons, slug, owned }: LessonListProps) {
  const { t } = useT();
  const ordered = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <ol className="divide-y divide-neutral-900/12 rounded-md border border-neutral-900/12">
      {ordered.map((lesson, index) => {
        const state = lessonState(lesson, owned);
        const duration = splitDuration(lesson.durationSec);
        const openable = state !== 'locked';

        const title = (
          <span className={state === 'locked' ? 'text-neutral-700' : 'text-neutral-900'}>
            {lesson.title}
          </span>
        );

        return (
          <li key={lesson.videoId} className="flex items-center gap-3 px-4 py-3">
            <KeyIcon state={state} className="shrink-0" />

            <span className="w-6 shrink-0 text-sm text-neutral-700 tabular-nums">{index + 1}.</span>

            <div className="min-w-0 flex-1">
              {/* A locked lesson is not a link: sending someone to a player
                  that will answer 403 is worse than showing the price. */}
              {openable ? (
                <Link to={routes.classroom(slug, lesson.videoId)}>{title}</Link>
              ) : (
                title
              )}

              {state === 'preview' && (
                <span className="ml-2 rounded-sm border border-neutral-900/15 px-2 py-0.5 text-xs text-neutral-700">
                  {t('lesson.freePreview')}
                </span>
              )}
            </div>

            <span className="shrink-0 text-sm text-neutral-700 tabular-nums">
              {duration.hours > 0
                ? t('product.durationHours', duration)
                : t('product.durationMinutes', duration)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
