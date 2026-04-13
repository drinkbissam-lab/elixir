export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const CART_UPDATED_EVENT = "cart-updated";

// Helper to get storage key with user ID
function getCartStorageKey(userId?: string): string {
  if (!userId) {
    return "cart_guest";
  }
  return `cart_${userId}`;
}

export function getCartItems(userId?: string): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storageKey = getCartStorageKey(userId);
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
}

export function getCartCount(items = getCartItems()) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function setCartItems(items: CartItem[], userId?: string) {
  const storageKey = getCartStorageKey(userId);
  localStorage.setItem(storageKey, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: items }));
}

export function addCartItem(item: Omit<CartItem, "quantity">, quantity: number, userId?: string) {
  const cartItems = getCartItems(userId);
  const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({ ...item, quantity });
  }

  setCartItems(cartItems, userId);
  return cartItems;
}

export function clearCart(userId?: string) {
  const storageKey = getCartStorageKey(userId);
  localStorage.removeItem(storageKey);
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: [] }));
}
