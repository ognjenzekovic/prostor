import type { components } from '../api/schema';
import { ApiError } from '../api/errors';
import productsPage from './products.json';

/**
 * Cart state for the mock backend.
 *
 * This module plays the server, so it is the one place allowed to do
 * arithmetic on money (spec 4.5a): the real API sends subtotal, discount and
 * total already computed, and the frontend must never add prices itself.
 * Sums are done in whole cents, never in floats.
 */

type Cart = components['schemas']['Cart'];
type CartItem = components['schemas']['CartItem'];
type Money = components['schemas']['Money'];
type ProductSummary = components['schemas']['ProductSummary'];

const ALL_PRODUCTS = productsPage.content as ProductSummary[];
const CURRENCY = 'RSD';

/**
 * Kept in sessionStorage so a page reload does not silently empty the cart
 * mid-demo. Mock-layer only — the real cart lives on the server.
 */
const STORAGE_KEY = 'mockCart';

type CartState = { productIds: string[]; couponCode: string | null };

function readState(): CartState {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as CartState;
  } catch {
    // Corrupt or unavailable storage just means an empty cart.
  }
  return { productIds: [], couponCode: null };
}

function writeState(state: CartState): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** "3490.00" -> 349000. Two decimals by contract, so this is exact. */
function toCents(amount: string): number {
  return Math.round(Number(amount) * 100);
}

function money(cents: number): Money {
  return { amount: (cents / 100).toFixed(2), currency: CURRENCY };
}

type Coupon = { discount: (subtotalCents: number) => number; expired?: boolean };

/** Mock coupons, including a broken one — error states need data too (4.3). */
const COUPONS: Record<string, Coupon> = {
  PROSTOR10: { discount: (subtotal) => Math.round(subtotal * 0.1) },
  MATURA500: { discount: () => 50000 },
  ISTEKAO: { discount: () => 0, expired: true },
};

function toCartItem(product: ProductSummary): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    type: product.type,
    coverUrl: product.coverUrl,
    price: product.price,
    accessMode: product.accessMode,
    accessDurationDays: product.accessDurationDays,
    accessUntil: product.accessUntil,
    addedAt: new Date().toISOString(),
  };
}

function build(state: CartState): Cart {
  const items = state.productIds
    .map((id) => ALL_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is ProductSummary => product !== undefined)
    .map(toCartItem);

  const subtotal = items.reduce((sum, item) => sum + toCents(item.price.amount), 0);

  const coupon = state.couponCode ? COUPONS[state.couponCode] : undefined;
  // Never discount below zero, and never discount an empty cart.
  const discount = coupon && subtotal > 0 ? Math.min(coupon.discount(subtotal), subtotal) : 0;

  return {
    items,
    couponCode: state.couponCode,
    subtotal: money(subtotal),
    discount: money(discount),
    total: money(subtotal - discount),
    updatedAt: new Date().toISOString(),
  };
}

export function getCart(): Cart {
  return build(readState());
}

/**
 * Adding is idempotent — a digital product is not bought twice — and a product
 * the user already has access to is refused, which is the 409 the purchase
 * flow branches on (spec 4.5).
 */
export function addItem(productId: string): Cart {
  const product = ALL_PRODUCTS.find((candidate) => candidate.id === productId);

  if (!product) {
    throw new ApiError(404, 'PRODUCT_NOT_FOUND', 'Proizvod ne postoji');
  }

  if (product.owned) {
    throw new ApiError(409, 'ALREADY_OWNED', 'Vec imate pristup ovom programu');
  }

  const state = readState();

  if (!state.productIds.includes(productId)) {
    state.productIds.push(productId);
    writeState(state);
  }

  return build(state);
}

export function removeItem(productId: string): Cart {
  const state = readState();
  state.productIds = state.productIds.filter((id) => id !== productId);
  writeState(state);
  return build(state);
}

export function applyCoupon(code: string): Cart {
  const normalized = code.trim().toUpperCase();
  const coupon = COUPONS[normalized];

  if (!coupon) {
    throw new ApiError(422, 'COUPON_INVALID', 'Kupon ne postoji');
  }

  if (coupon.expired) {
    throw new ApiError(422, 'COUPON_EXPIRED', 'Kupon je istekao');
  }

  const state = readState();
  state.couponCode = normalized;
  writeState(state);
  return build(state);
}

export function removeCoupon(): Cart {
  const state = readState();
  state.couponCode = null;
  writeState(state);
  return build(state);
}

export function clearCart(): void {
  writeState({ productIds: [], couponCode: null });
}
