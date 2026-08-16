import { PagePlaceholder } from './PagePlaceholder';

/**
 * Every route from spec 4.4 that has no screen yet.
 *
 * They live in one file on purpose: each one is a title and nothing else, and
 * this file shrinks as pages get built (CatalogPage next, then
 * CourseDetailPage). When a page becomes real it moves to src/pages/<Name>.tsx
 * and its export is deleted from here.
 */

export const HomePage = () => <PagePlaceholder titleKey="pages.home" />;
export const CatalogPage = () => <PagePlaceholder titleKey="pages.catalog" />;
export const CourseDetailPage = () => <PagePlaceholder titleKey="pages.course" />;
export const GradePage = () => <PagePlaceholder titleKey="pages.grade" />;
export const AreaPage = () => <PagePlaceholder titleKey="pages.area" />;
export const MalaMaturaPage = () => <PagePlaceholder titleKey="pages.malaMatura" />;
export const PrijemniPage = () => <PagePlaceholder titleKey="pages.prijemni" />;
export const BundlesPage = () => <PagePlaceholder titleKey="pages.bundles" />;
export const AboutPage = () => <PagePlaceholder titleKey="pages.about" />;
export const InstructorsPage = () => <PagePlaceholder titleKey="pages.instructors" />;
export const InstructorPage = () => <PagePlaceholder titleKey="pages.instructor" />;
export const BlogPage = () => <PagePlaceholder titleKey="pages.blog" />;
export const PostPage = () => <PagePlaceholder titleKey="pages.post" />;
export const ContactPage = () => <PagePlaceholder titleKey="pages.contact" />;

export const LoginPage = () => <PagePlaceholder titleKey="pages.login" />;
export const RegisterPage = () => <PagePlaceholder titleKey="pages.register" />;
export const ForgotPasswordPage = () => <PagePlaceholder titleKey="pages.forgotPassword" />;

export const CartPage = () => <PagePlaceholder titleKey="pages.cart" />;
export const CheckoutPage = () => <PagePlaceholder titleKey="pages.checkout" />;
export const CheckoutSuccessPage = () => <PagePlaceholder titleKey="pages.checkoutSuccess" />;
export const CheckoutCancelledPage = () => <PagePlaceholder titleKey="pages.checkoutCancelled" />;
export const LibraryPage = () => <PagePlaceholder titleKey="pages.library" />;
export const ClassroomPage = () => <PagePlaceholder titleKey="pages.classroom" />;
export const AccountPage = () => <PagePlaceholder titleKey="pages.account" />;
export const OrdersPage = () => <PagePlaceholder titleKey="pages.orders" />;

export const AdminDashboardPage = () => <PagePlaceholder titleKey="pages.admin" />;
export const AdminProductsPage = () => <PagePlaceholder titleKey="pages.adminProducts" />;
export const AdminOrdersPage = () => <PagePlaceholder titleKey="pages.adminOrders" />;
export const AdminCouponsPage = () => <PagePlaceholder titleKey="pages.adminCoupons" />;

export const TermsOfServicePage = () => <PagePlaceholder titleKey="pages.terms" />;
export const PrivacyPolicyPage = () => <PagePlaceholder titleKey="pages.privacy" />;
export const ReturnsPage = () => <PagePlaceholder titleKey="pages.returns" />;
