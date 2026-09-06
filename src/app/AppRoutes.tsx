import { Route, Routes } from 'react-router-dom';
import { RootLayout } from '../components/layout/RootLayout';
import { NotFoundPage } from '../pages/NotFoundPage';
import { CatalogPage } from '../pages/CatalogPage';
import { CourseDetailPage } from '../pages/CourseDetailPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { RequireAuth } from './RequireAuth';
import { routes } from '../lib/routes';
import {
  AboutPage,
  AccountPage,
  AdminCouponsPage,
  AdminDashboardPage,
  AdminOrdersPage,
  AdminProductsPage,
  AreaPage,
  BlogPage,
  BundlesPage,
  CheckoutCancelledPage,
  CheckoutPage,
  CheckoutSuccessPage,
  ClassroomPage,
  ContactPage,
  GradePage,
  InstructorPage,
  InstructorsPage,
  LibraryPage,
  MalaMaturaPage,
  OrdersPage,
  PostPage,
  PrijemniPage,
  PrivacyPolicyPage,
  ReturnsPage,
  TermsOfServicePage,
} from '../pages/stubs';

/**
 * Route table from spec 4.4.
 *
 * Paths come from routes.ts even here — the generators take ':slug' the same
 * way they take a real slug, so introducing the /:lang prefix (ODLUKA-12)
 * still touches one file.
 *
 * TODO: React.lazy for the admin chunk (spec 4.9) once those pages hold
 * anything.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public */}
        <Route path={routes.home()} element={<HomePage />} />
        <Route path={routes.catalog()} element={<CatalogPage />} />
        <Route path={routes.course(':slug')} element={<CourseDetailPage />} />
        <Route path={routes.grade(':grade')} element={<GradePage />} />
        <Route path={routes.area(':area')} element={<AreaPage />} />
        <Route path={routes.examPrepMalaMatura()} element={<MalaMaturaPage />} />
        <Route path={routes.examPrepPrijemni()} element={<PrijemniPage />} />
        <Route path={routes.bundles()} element={<BundlesPage />} />
        <Route path={routes.about()} element={<AboutPage />} />
        <Route path={routes.instructors()} element={<InstructorsPage />} />
        <Route path={routes.instructor(':slug')} element={<InstructorPage />} />
        <Route path={routes.blog()} element={<BlogPage />} />
        <Route path={routes.post(':slug')} element={<PostPage />} />
        <Route path={routes.contact()} element={<ContactPage />} />

        {/* Auth */}
        <Route path={routes.login()} element={<LoginPage />} />
        <Route path={routes.register()} element={<RegisterPage />} />
        <Route path={routes.forgotPassword()} element={<ForgotPasswordPage />} />

        {/* Authenticated */}
        <Route element={<RequireAuth />}>
          <Route path={routes.cart()} element={<CartPage />} />
          <Route path={routes.checkout()} element={<CheckoutPage />} />
          <Route path={routes.checkoutSuccess()} element={<CheckoutSuccessPage />} />
          <Route path={routes.checkoutCancelled()} element={<CheckoutCancelledPage />} />
          <Route path={routes.library()} element={<LibraryPage />} />
          <Route path={routes.classroom(':slug', ':lessonId')} element={<ClassroomPage />} />
          <Route path={routes.account()} element={<AccountPage />} />
          <Route path={routes.orders()} element={<OrdersPage />} />
        </Route>

        {/* Admin */}
        <Route element={<RequireAuth role="ADMIN" />}>
          <Route path={routes.admin()} element={<AdminDashboardPage />} />
          <Route path={routes.adminProducts()} element={<AdminProductsPage />} />
          <Route path={routes.adminOrders()} element={<AdminOrdersPage />} />
          <Route path={routes.adminCoupons()} element={<AdminCouponsPage />} />
        </Route>

        {/* Legal */}
        <Route path={routes.termsOfService()} element={<TermsOfServicePage />} />
        <Route path={routes.privacyPolicy()} element={<PrivacyPolicyPage />} />
        <Route path={routes.returns()} element={<ReturnsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
