import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Skeleton } from '../components/common/Skeleton';
import { useAuth } from './AuthContext';
import { routes } from '../lib/routes';

/**
 * Gate for 🔒 and 👑 routes (spec 4.4).
 *
 * While the stored session is being verified the route renders a skeleton
 * rather than redirecting: bouncing a signed-in user to the sign-in page for
 * the few hundred milliseconds it takes to confirm the token is worse than
 * waiting.
 *
 * The attempted path travels along as `?redirect=`, so signing in returns the
 * reader where they were going (spec 4.5).
 */
export function RequireAuth({ role }: { role?: 'ADMIN' } = {}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="mt-4 h-64 w-full" />
      </Container>
    );
  }

  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`${routes.login()}?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  // A student who lands on an admin URL is not asked to sign in again — they
  // are already signed in, just not for this.
  if (role === 'ADMIN' && user.role !== 'ADMIN') {
    return <Navigate to={routes.home()} replace />;
  }

  return <Outlet />;
}
