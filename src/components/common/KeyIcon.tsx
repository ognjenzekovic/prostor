/**
 * The key metaphor as interface state (docs/06 §6.4).
 *
 * Buying is unlocking, so the icon follows the entitlement data instead of
 * decorating it: a keyhole while the lesson is closed, an open arch for a free
 * preview, a brass key once access exists.
 */
export type KeyState = 'locked' | 'preview' | 'unlocked';

const COLOR: Record<KeyState, string> = {
  locked: 'text-neutral-500',
  preview: 'text-neutral-700',
  unlocked: 'text-neutral-900',
};

export function KeyIcon({ state, className = '' }: { state: KeyState; className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`${COLOR[state]} ${className}`}
    >
      {state === 'unlocked' ? (
        // Key: bow, shaft, two teeth.
        <>
          <circle cx="6.5" cy="7" r="3.25" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8.9 9.1 16 16.2M13 14.3l-1.6 1.6M15 16.3l-1.3 1.3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        // Keyhole in a shackle; the preview arch is open on one side.
        <>
          <path
            d={
              state === 'preview'
                ? 'M6.5 8.5V6a3.5 3.5 0 0 1 6.6-1.6'
                : 'M6.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5'
            }
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect
            x="4"
            y="8.5"
            width="12"
            height="8.5"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="10" cy="12.75" r="1.25" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
