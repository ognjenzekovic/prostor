import { Link } from 'react-router-dom';
import { Container } from './Container';
import { useT } from '../../hooks/useT';
import { routes } from '../../lib/routes';

const SECTIONS = [
  {
    titleKey: 'footer.learn',
    links: [
      { to: routes.catalog(), key: 'nav.catalog' },
      { to: routes.bundles(), key: 'nav.bundles' },
      { to: routes.examPrepMalaMatura(), key: 'footer.malaMatura' },
      { to: routes.examPrepPrijemni(), key: 'footer.prijemni' },
    ],
  },
  {
    titleKey: 'footer.about',
    links: [
      { to: routes.about(), key: 'nav.about' },
      { to: routes.instructors(), key: 'footer.instructors' },
      { to: routes.blog(), key: 'nav.blog' },
      { to: routes.contact(), key: 'nav.contact' },
    ],
  },
  {
    // Required before any payment goes live (spec 4.4).
    titleKey: 'footer.legal',
    links: [
      { to: routes.termsOfService(), key: 'footer.terms' },
      { to: routes.privacyPolicy(), key: 'footer.privacy' },
      { to: routes.returns(), key: 'footer.returns' },
    ],
  },
];

export function Footer() {
  const { t } = useT();

  return (
    <footer className="mt-16 border-t border-neutral-900/12 bg-neutral-100">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-semibold text-neutral-900">
              {t('common.brand')}
            </p>
            <p className="mt-2 text-sm text-neutral-700">{t('footer.tagline')}</p>
          </div>

          {SECTIONS.map((section) => (
            <nav key={section.titleKey} aria-label={t(section.titleKey)}>
              <h2 className="font-sans text-sm font-semibold text-neutral-900">
                {t(section.titleKey)}
              </h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-neutral-700 hover:text-neutral-900">
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-10 text-sm text-neutral-500">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </Container>
    </footer>
  );
}
