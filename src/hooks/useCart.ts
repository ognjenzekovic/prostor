import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { components } from '../api/schema';
import { useAuth } from '../app/AuthContext';
import {
  addToCart,
  applyCoupon,
  clearCart,
  getCart,
  removeCoupon,
  removeFromCart,
} from '../api/cart';

type Cart = components['schemas']['Cart'];

const CART_KEY = ['cart'];

/**
 * The cart, and the actions that change it.
 *
 * Every endpoint answers with the whole cart, so each mutation writes the
 * response straight into the cache instead of refetching — the totals on
 * screen are the ones the server just calculated, with no in-between state
 * where the list and the total disagree.
 *
 * The cart belongs to an account, so the query only runs once there is one;
 * asking while signed out would just collect 401s.
 */
export function useCart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: CART_KEY,
    queryFn: getCart,
    enabled: Boolean(user),
  });

  const write = (cart: Cart) => queryClient.setQueryData(CART_KEY, cart);

  const add = useMutation({ mutationFn: addToCart, onSuccess: write });
  const remove = useMutation({ mutationFn: removeFromCart, onSuccess: write });
  const coupon = useMutation({ mutationFn: applyCoupon, onSuccess: write });
  const clearCoupon = useMutation({ mutationFn: removeCoupon, onSuccess: write });

  // Emptying answers 204, so there is no cart to write back — refetch instead.
  const clear = useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });

  return { ...query, add, remove, coupon, clearCoupon, clear };
}

/**
 * Item count for the header badge.
 *
 * Separate from useCart so the header does not re-render on every mutation
 * state change, and reads the same cache entry.
 */
export function useCartCount(): number {
  const { user } = useAuth();
  const { data } = useQuery({ queryKey: CART_KEY, queryFn: getCart, enabled: Boolean(user) });
  return data?.items.length ?? 0;
}
