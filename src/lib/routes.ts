/**
 * Route path generators.
 *
 * ONLY place where route paths exist. Never hardcode paths in JSX.
 * When /:lang prefix is needed (ODLUKA-12), only this file changes.
 */
export const routes = {
  // Public
  home: () => '/',
  catalog: () => '/kursevi',
  course: (slug: string) => `/kursevi/${slug}`,
  grade: (grade: string) => `/razred/${grade}`,
  area: (area: string) => `/oblast/${area}`,
  examPrepMalaMatura: () => '/priprema/mala-matura',
  examPrepPrijemni: () => '/priprema/prijemni',
  bundles: () => '/paketi',
  about: () => '/ko-smo-mi',
  instructors: () => '/mentori',
  instructor: (slug: string) => `/mentori/${slug}`,
  blog: () => '/blog',
  post: (slug: string) => `/blog/${slug}`,
  contact: () => '/kontakt',

  // Auth
  login: () => '/prijava',
  register: () => '/registracija',
  forgotPassword: () => '/zaboravljena-lozinka',

  // Authenticated
  cart: () => '/korpa',
  checkout: () => '/placanje',
  checkoutSuccess: () => '/placanje/uspeh',
  checkoutCancelled: () => '/placanje/otkazano',
  library: () => '/moji-kursevi',
  classroom: (slug: string, lessonId: string) => `/ucionica/${slug}/${lessonId}`,
  account: () => '/nalog',
  orders: () => '/nalog/porudzbine',

  // Admin
  admin: () => '/admin',
  adminProducts: () => '/admin/proizvodi',
  adminOrders: () => '/admin/porudzbine',
  adminCoupons: () => '/admin/kuponi',

  // Legal
  termsOfService: () => '/uslovi-koriscenja',
  privacyPolicy: () => '/politika-privatnosti',
  returns: () => '/reklamacije',
} as const;
