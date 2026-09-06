import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Container } from './Container';
import { LocaleSwitcher } from './LocaleSwitcher';
import { LinkButton } from '../common/Button';
import { useAuth } from '../../app/AuthContext';
import { useCartCount } from '../../hooks/useCart';
import { useT } from '../../hooks/useT';
import { routes } from '../../lib/routes';

const NAV_ITEMS = [
  { to: routes.catalog(), key: 'nav.catalog' },
  { to: routes.bundles(), key: 'nav.bundles' },
  { to: routes.examPrepMalaMatura(), key: 'nav.examPrep' },
  { to: routes.blog(), key: 'nav.blog' },
  { to: routes.about(), key: 'nav.about' },
  { to: routes.contact(), key: 'nav.contact' },
];

/** Cart link with its count; the number is decoration, the label carries it. */
function CartLink({ count, className }: { count: number; className?: string }) {
  const { t } = useT();

  return (
    <NavLink
      to={routes.cart()}
      className={navLinkClass}
      aria-label={count > 0 ? t('nav.cartWithCount', { count }) : undefined}
    >
      <span className={className}>
        {t('nav.cart')}
        {count > 0 && (
          <span
            aria-hidden="true"
            className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-neutral-900 text-xs text-neutral-50"
          >
            {count}
          </span>
        )}
      </span>
    </NavLink>
  );
}

/**
 * Sign-in button, or the account link and a way out.
 *
 * The name is a link to the account page rather than a menu: one dropdown for
 * two destinations is machinery the screen does not need yet.
 */
function AccountControls({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useT();
  const { user, signOut } = useAuth();

  if (!user) {
    return <LinkButton to={routes.login()}>{t('nav.login')}</LinkButton>;
  }

  return (
    <div className="flex items-center gap-4">
      {/* First name only: the bar is tight, and it is how we address people.
          The full name stays available on hover and to a screen reader. */}
      <NavLink
        to={routes.account()}
        className={navLinkClass}
        title={`${user.firstName} ${user.lastName}`}
      >
        {user.firstName}
      </NavLink>
      <button
        type="button"
        onClick={() => {
          void signOut();
          onNavigate?.();
        }}
        className="text-sm text-neutral-700 underline underline-offset-4 hover:text-neutral-900"
      >
        {t('nav.logout')}
      </button>
    </div>
  );
}

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? 'text-neutral-900 underline decoration-neutral-900 decoration-2 underline-offset-8'
    : 'text-neutral-700 hover:text-neutral-900';
}

export function Header() {
  const { t } = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Navigating away must close the panel, otherwise it covers the new page.
  // Adjusted during render rather than in an effect, so the panel is never
  // painted on top of the page it just left.
  const cartCount = useCartCount();
  const [lastPath, setLastPath] = useState(location.pathname);

  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
  }

  return (
    // neutral-100, not the page's neutral-50: at the same value the bar is
    // held together only by its hairline. Header and footer now bracket the
    // page in the same tone.
    <header className="sticky top-0 z-20 border-b border-neutral-900/12 bg-neutral-100">
      <Container className="flex items-center justify-between gap-4 py-4">
        {/* TODO: replace the wordmark with the owl logo once the SVG arrives (docs/06.4). */}
        <Link
          to={routes.home()}
          className="font-display text-xl font-semibold text-neutral-900"
        >
          {t('common.brand')}
        </Link>

        <nav aria-label={t('nav.primary')} className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass}>
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LocaleSwitcher />
          <CartLink count={cartCount} />
          <AccountControls />
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-sm p-2 text-neutral-900 md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" />
            )}
          </svg>
        </button>
      </Container>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-neutral-900/12 md:hidden">
          <Container className="py-4">
            <nav aria-label={t('nav.primary')}>
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className={navLinkClass}>
                      <span className="block py-2">{t(item.key)}</span>
                    </NavLink>
                  </li>
                ))}
                <li>
                  <CartLink count={cartCount} className="block py-2" />
                </li>
              </ul>
            </nav>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <LocaleSwitcher />
              <AccountControls onNavigate={() => setMenuOpen(false)} />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
