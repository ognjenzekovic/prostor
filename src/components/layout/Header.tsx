import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Container } from './Container';
import { ScriptSwitcher } from './ScriptSwitcher';
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

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? 'text-neutral-900 underline decoration-brand-600 decoration-2 underline-offset-8'
    : 'text-neutral-700 hover:text-neutral-900';
}

export function Header() {
  const { t } = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Navigating away must close the panel, otherwise it covers the new page.
  // Adjusted during render rather than in an effect, so the panel is never
  // painted on top of the page it just left.
  const [lastPath, setLastPath] = useState(location.pathname);

  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
  }

  return (
    <header className="border-b border-neutral-900/12 bg-neutral-50">
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
          <ScriptSwitcher />
          <NavLink to={routes.cart()} className={navLinkClass}>
            {t('nav.cart')}
          </NavLink>
          <Link
            to={routes.login()}
            className="rounded-sm bg-brand-500 px-4 py-2 text-sm font-medium text-neutral-900"
          >
            {t('nav.login')}
          </Link>
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
                {[...NAV_ITEMS, { to: routes.cart(), key: 'nav.cart' }].map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className={navLinkClass}>
                      <span className="block py-2">{t(item.key)}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-4 flex items-center justify-between gap-4">
              <ScriptSwitcher />
              <Link
                to={routes.login()}
                className="rounded-sm bg-brand-500 px-4 py-2 text-sm font-medium text-neutral-900"
              >
                {t('nav.login')}
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
