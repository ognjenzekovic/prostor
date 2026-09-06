import type { components } from '../api/schema';

type SubjectArea = components['schemas']['SubjectArea'];

/**
 * Subject area -> pastel token (docs/06 §6.2).
 *
 * Colour carries information here: the filter panel reads without a legend and
 * a card gives away its area before the title. That only holds if the mapping
 * lives in one place.
 *
 * Class names are written out in full — Tailwind scans source text, so
 * `bg-accent-${n}` would never be generated.
 */
const AREA_BACKGROUND: Record<SubjectArea, string> = {
  GRAMATIKA: 'bg-accent-1',
  PRAVOPIS: 'bg-accent-2',
  KNJIZEVNOST: 'bg-accent-3',
  LEKTIRA: 'bg-accent-4',
  PISMENO_IZRAZAVANJE: 'bg-accent-5',
  GOVORNE_VEZBE: 'bg-accent-6',
};

/** Background class for an area; neutral when a product carries no area. */
export function areaBackground(area?: SubjectArea): string {
  return area ? AREA_BACKGROUND[area] : 'bg-neutral-100';
}
