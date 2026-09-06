import { BrowserRouter, HashRouter } from 'react-router-dom';
import type { ReactNode } from 'react';

const useHash = import.meta.env.VITE_USE_HASH_ROUTER === 'true';

/**
 * HashRouter is a stopgap for hosts without server-side rewrites; BrowserRouter
 * is what production needs, because hash routes are not indexed and search is
 * the main channel (spec 4.1).
 *
 * The basename comes from Vite's BASE_URL so it always matches the `base` the
 * bundle was built with — hardcoding it here meant two places to change and a
 * blank page whenever they disagreed.
 */
export function AppRouter({ children }: { children: ReactNode }) {
  const Impl = useHash ? HashRouter : BrowserRouter;
  return <Impl basename={useHash ? undefined : import.meta.env.BASE_URL}>{children}</Impl>;
}
