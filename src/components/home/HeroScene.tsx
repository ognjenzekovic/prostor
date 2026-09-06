import { useT } from '../../hooks/useT';

/**
 * The client's sketch, as one drawing: a lock, a hand that unlocks it, and
 * then the same frame standing there as a bookcase carrying the name
 * (docs/06 §6.5).
 *
 * The frame rectangle is drawn once and never moves — it is the lock plate and
 * the carcass at the same time, which is what makes the change read as "this
 * became that" rather than as two pictures swapping.
 *
 * Spines use the six subject-area pastels, so the shelf doubles as the colour
 * key the catalogue uses (§6.2). The name is the only full run of seven, which
 * is what keeps it reading as a word rather than as more shelf.
 */

const FRAME = { x: 30, y: 24, width: 240, height: 248 };

/** Top edge of each shelf board. Books stand on these. */
const BOARDS = [104, 182, 260];
const BOARD_HEIGHT = 6;

/** The name, on the middle shelf. Narrow spines so the row stays light. */
const SPINES = [
  { x: 55, top: 130, fill: 'fill-accent-1', letter: 'P' },
  { x: 83, top: 124, fill: 'fill-accent-2', letter: 'R' },
  { x: 111, top: 134, fill: 'fill-accent-3', letter: 'O' },
  { x: 139, top: 120, fill: 'fill-accent-4', letter: 'S' },
  { x: 167, top: 128, fill: 'fill-accent-5', letter: 'T' },
  { x: 195, top: 126, fill: 'fill-accent-6', letter: 'O' },
  { x: 223, top: 132, fill: 'fill-accent-1', letter: 'R' },
];

const SPINE_WIDTH = 22;
const NAME_BASELINE = 182;

/** Books on the shelves above and below; a few carry colour to break up the row. */
type Book = { x: number; width: number; height: number; baseline: number; fill?: string };

/** Plain paper is the default spine; only the listed ones are tinted. */
const PLAIN_FILL = 'fill-neutral-50';

const UPRIGHT: Book[] = [
  { x: 46, width: 20, height: 56, baseline: 104 },
  { x: 68, width: 14, height: 62, baseline: 104, fill: 'fill-accent-3' },
  { x: 84, width: 22, height: 50, baseline: 104 },
  { x: 108, width: 16, height: 58, baseline: 104 },
  { x: 126, width: 18, height: 54, baseline: 104, fill: 'fill-accent-5' },
  { x: 146, width: 24, height: 60, baseline: 104 },
  { x: 172, width: 14, height: 48, baseline: 104 },

  { x: 46, width: 16, height: 50, baseline: 260 },
  { x: 64, width: 22, height: 58, baseline: 260, fill: 'fill-accent-2' },
  { x: 88, width: 14, height: 46, baseline: 260 },
  { x: 104, width: 20, height: 54, baseline: 260 },
  { x: 126, width: 16, height: 60, baseline: 260 },
  { x: 144, width: 24, height: 52, baseline: 260, fill: 'fill-accent-6' },
  { x: 170, width: 18, height: 56, baseline: 260 },
];

/** Stacks lying flat, so the shelves do not read as a row of identical bars. */
const LYING: Book[] = [
  { x: 196, width: 56, height: 10, baseline: 104 },
  { x: 200, width: 52, height: 10, baseline: 94 },
  { x: 192, width: 58, height: 10, baseline: 260 },
  { x: 196, width: 54, height: 10, baseline: 250, fill: 'fill-accent-4' },
];

const PLAIN = [...UPRIGHT, ...LYING];

/** Books rise in sequence; the name lands last, after the shelves are filled. */
const PLAIN_STEP = 18;
const NAME_START = PLAIN.length * PLAIN_STEP + 60;
const NAME_STEP = 50;

export function HeroScene({ className = '' }: { className?: string }) {
  const { t } = useT();

  return (
    <svg
      viewBox="0 0 300 300"
      role="img"
      aria-label={t('home.hero.sceneAlt')}
      className={`w-full ${className}`}
    >
      {/* The frame: lock plate first, bookcase after. Drawn once. */}
      <rect
        x={FRAME.x}
        y={FRAME.y}
        width={FRAME.width}
        height={FRAME.height}
        rx="6"
        className="fill-neutral-50 stroke-neutral-900"
        strokeWidth="3"
      />

      {/* Keyhole, centred in the frame */}
      <g className="hero-lock">
        <circle cx="150" cy="130" r="18" className="fill-neutral-900" />
        <path d="M141 142 L136 180 H164 L159 142 Z" className="fill-neutral-900" />
      </g>

      {/* Hand bringing the key in, then leaving */}
      <g className="hero-key">
        <circle cx="258" cy="130" r="13" fill="none" className="stroke-neutral-900" strokeWidth="5" />
        <path d="M245 130 H152" className="stroke-neutral-900" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M178 130 V142 M191 130 V138"
          className="stroke-neutral-900"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M270 108 h32 a12 12 0 0 1 12 12 v20 a12 12 0 0 1 -12 12 h-32 a22 22 0 0 1 0 -44 z"
          className="fill-neutral-100 stroke-neutral-900"
          strokeWidth="3"
        />
        <path
          d="M282 116 v28 M295 116 v28"
          className="stroke-neutral-900"
          strokeWidth="2"
          opacity="0.45"
        />
      </g>

      {/* Everything else on the shelves — black and white only */}
      {PLAIN.map((book, index) => (
        <rect
          key={`${book.baseline}-${book.x}-${book.height}`}
          className={`hero-book ${book.fill ?? PLAIN_FILL} stroke-neutral-900`}
          style={{ animationDelay: `${index * PLAIN_STEP}ms` }}
          x={book.x}
          y={book.baseline - book.height}
          width={book.width}
          height={book.height}
          rx="2"
          strokeWidth="2"
        />
      ))}

      {/* The name */}
      {SPINES.map((spine, index) => (
        <g
          key={`${spine.letter}-${spine.x}`}
          className="hero-book"
          style={{ animationDelay: `${NAME_START + index * NAME_STEP}ms` }}
        >
          <rect
            x={spine.x}
            y={spine.top}
            width={SPINE_WIDTH}
            height={NAME_BASELINE - spine.top}
            rx="2"
            className={`${spine.fill} stroke-neutral-900`}
            strokeWidth="2"
          />
          <text
            x={spine.x + SPINE_WIDTH / 2}
            y={NAME_BASELINE - 12}
            textAnchor="middle"
            className="font-display fill-neutral-900"
            fontSize="12"
            fontWeight="600"
          >
            {spine.letter}
          </text>
        </g>
      ))}

      {/* Shelf boards */}
      <g className="hero-plank">
        {BOARDS.map((y) => (
          <rect
            key={y}
            x={FRAME.x + 6}
            y={y}
            width={FRAME.width - 12}
            height={BOARD_HEIGHT}
            rx="2"
            className="fill-neutral-900"
          />
        ))}
      </g>
    </svg>
  );
}
