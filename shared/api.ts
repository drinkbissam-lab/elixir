/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Request type for sending order confirmation email
 */
export interface OrderConfirmationEmailRequest {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  phoneNumber: string;
  neighborhood: string;
  address: string;
  addressDetails: string;
  items: string;
  total: number;
  paymentMethod: "card" | "cash";
}

/**
 * Response type for order confirmation email
 */
export interface OrderConfirmationEmailResponse {
  success: boolean;
  message: string;
}

/**
 * Saved card for reuse
 */
export interface SavedCard {
  id: string;
  lastFourDigits: string;
  cardholderName: string;
  expiryDate: string;
  isDefault: boolean;
  createdAt: string;
}

/**
 * Request to save a card
 */
export interface SaveCardRequest {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  isDefault?: boolean;
}

/**
 * Response for card management operations
 */
export interface CardManagementResponse {
  success: boolean;
  message: string;
  data?: SavedCard[];
}
