import acrosticImage from '../../assets/PROSTOR.svg';
import { useT } from '../../hooks/useT';

/**
 * „Ko smo mi? Mentori." — the client's own drawing (docs/06 §6.1).
 *
 * The file carries a wide empty margin, so it is cropped to the measured ink
 * box rather than placed as-is; otherwise a third of the section is blank.
 * Numbers below are the ink bounds within the 1414x2000 viewBox, plus air.
 *
 * The middle grid track is given a width on purpose. The cropped image is an
 * absolutely positioned child, which contributes nothing to intrinsic sizing,
 * so an `auto` track would collapse to zero and take the drawing with it.
 */
const CROP = {
  /** Source viewBox. */
  imageWidth: 1414,
  imageHeight: 2000,
  /** Ink box with ~40 units of air around it. */
  left: 162,
  top: 228,
  width: 1180,
  height: 1445,
};

const percent = (value: number) => `${(value * 100).toFixed(3)}%`;

export function Acrostic() {
  const { t } = useT();

  return (
    <section className="mt-16">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_16rem_1fr] lg:grid-cols-[1fr_20rem_1fr]">
        <h2 className="md:text-right">{t('home.acrostic.question')}</h2>

        <div
          className="relative mx-auto w-full max-w-sm overflow-hidden md:max-w-none"
          style={{ aspectRatio: `${CROP.width} / ${CROP.height}` }}
        >
          <img
            src={acrosticImage}
            alt={t('home.acrostic.imageAlt')}
            width={CROP.width}
            height={CROP.height}
            loading="lazy"
            className="absolute max-w-none"
            style={{
              width: percent(CROP.imageWidth / CROP.width),
              left: percent(-CROP.left / CROP.width),
              top: percent(-CROP.top / CROP.height),
            }}
          />
        </div>

        {/* The answer is set exactly like the question, so the pair reads as one
            exchange. The size repeats the h2 step from docs/06 §6.3 because a
            <p> does not inherit it. */}
        <p className="font-display text-[clamp(1.5rem,3.5vw,2rem)] font-semibold text-neutral-900 uppercase">
          {t('home.acrostic.answer')}
        </p>
      </div>
    </section>
  );
}
