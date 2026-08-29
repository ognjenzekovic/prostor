import type { components } from './schema';
import { apiDelete, apiGet, apiPost } from './http';

type Cart = components['schemas']['Cart'];

/**
 * Cart endpoints.
 *
 * Every call answers with the whole cart, already totalled by the server, so
 * the frontend never adds prices itself (spec 4.5a).
 */

export async function getCart(): Promise<Cart> {
  return apiGet<Cart>('/cart');
}

/**
 * Add a product. Quantity is always one — a digital product is not bought
 * twice — and adding the same product again is idempotent.
 *
 * @throws ApiError - 409 ALREADY_OWNED when an active entitlement exists
 */
export async function addToCart(productId: string): Promise<Cart> {
  return apiPost<Cart>('/cart/items', { productId });
}

export async function removeFromCart(productId: string): Promise<Cart> {
  return apiDelete<Cart>(`/cart/items/${productId}`);
}

/**
 * Apply a coupon code.
 *
 * @throws ApiError - 422 COUPON_INVALID or COUPON_EXPIRED
 */
export async function applyCoupon(code: string): Promise<Cart> {
  return apiPost<Cart>('/cart/coupon', { code });
}

export async function removeCoupon(): Promise<Cart> {
  return apiDelete<Cart>('/cart/coupon');
}

/** Empty the cart. Answers 204, so there is nothing to read back. */
export async function clearCart(): Promise<void> {
  return apiDelete<void>('/cart');
}
