export type OrderStatus = "completed" | "pending" | "cancelled" | "failed" | "confirmed";
export type PaymentStatus = "pending" | "paid" | "cancelled" | "failed" | "completed";

export interface LocalOrder {
  id: string;
  date: string;
  items: string;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  stripeSessionId?: string;
}

const ORDERS_STORAGE_KEY = "userOrders";

// Helper to get storage key with user ID
function getOrdersStorageKey(userId?: string): string {
  if (!userId) {
    return "userOrders_guest";
  }
  return `userOrders_${userId}`;
}

export const getOrders = (userId?: string): LocalOrder[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storageKey = getOrdersStorageKey(userId);
  const savedOrders = localStorage.getItem(storageKey);
  if (!savedOrders) {
    return [];
  }

  try {
    return (JSON.parse(savedOrders) as LocalOrder[]).map((order) => ({
      ...order,
      payment_status: order.payment_status || (order.status === "completed" ? "paid" : order.status === "cancelled" ? "cancelled" : "pending"),
    }));
  } catch {
    return [];
  }
};

export const setOrders = (orders: LocalOrder[], userId?: string) => {
  const storageKey = getOrdersStorageKey(userId);
  localStorage.setItem(storageKey, JSON.stringify(orders));
};

export const upsertOrder = (order: LocalOrder, userId?: string) => {
  const orders = getOrders(userId);
  const index = orders.findIndex((existingOrder) => existingOrder.id === order.id);

  if (index >= 0) {
    orders[index] = order;
  } else {
    orders.unshift(order);
  }

  setOrders(orders, userId);
  return orders;
};

export const updateOrder = (orderId: string, updates: Partial<LocalOrder>) => {
  const orders = getOrders().map((order) =>
    order.id === orderId ? { ...order, ...updates } : order
  );

  setOrders(orders);
  return orders;
};
