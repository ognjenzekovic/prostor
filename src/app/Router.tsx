import { BrowserRouter, HashRouter } from 'react-router-dom';
import type { ReactNode } from 'react';

const useHash = import.meta.env.VITE_USE_HASH_ROUTER === 'true';

export function AppRouter({ children }: { children: ReactNode }) {
    const Impl = useHash ? HashRouter : BrowserRouter;
    return <Impl basename={useHash ? undefined : '/prostor/'}>{children}</Impl>;
}