import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useT } from '../../hooks/useT';

/**
 * Frame shared by every page: header, one <main> landmark, footer.
 * Pages render their own single <h1> inside the outlet (spec 4.8).
 */
export function RootLayout() {
  const { t } = useT();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-sm focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-neutral-50"
      >
        {t('common.skipToContent')}
      </a>

      <Header />

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
