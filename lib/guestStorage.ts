// lib/guestStorage.ts
// Login නැතිව cart/wishlist localStorage-ෙ save කරන utilities

export interface GuestCartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  category: string;
}

export interface GuestWishlistItem {
  productId: string;
  name: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  category: string;
}

const CART_KEY = "bellora_guest_cart";
const WISHLIST_KEY = "bellora_guest_wishlist";

// ─── CART ────────────────────────────────────────────────

export const getGuestCart = (): GuestCartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

export const addToGuestCart = (item: GuestCartItem): void => {
  const cart = getGuestCart();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const updateGuestCartQuantity = (productId: string, quantity: number): void => {
  if (quantity <= 0) {
    removeFromGuestCart(productId);
    return;
  }
  const cart = getGuestCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) item.quantity = quantity;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const removeFromGuestCart = (productId: string): void => {
  const cart = getGuestCart().filter((i) => i.productId !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearGuestCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

// ─── WISHLIST ─────────────────────────────────────────────

export const getGuestWishlist = (): GuestWishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};

export const isInGuestWishlist = (productId: string): boolean =>
  getGuestWishlist().some((i) => i.productId === productId);

/** Returns true if added, false if removed */
export const toggleGuestWishlist = (item: GuestWishlistItem): boolean => {
  const list = getGuestWishlist();
  const idx = list.findIndex((i) => i.productId === item.productId);
  if (idx >= 0) {
    list.splice(idx, 1);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    return false;
  } else {
    list.push(item);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    return true;
  }
};

export const removeFromGuestWishlist = (productId: string): void => {
  const list = getGuestWishlist().filter((i) => i.productId !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
};

export const clearGuestWishlist = (): void => {
  localStorage.removeItem(WISHLIST_KEY);
};
