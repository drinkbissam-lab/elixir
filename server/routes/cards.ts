import { RequestHandler } from "express";
import {
  SaveCardRequest,
  CardManagementResponse,
  SavedCard,
} from "@shared/api";

// In-memory storage for demo purposes
// In production, use a database with encryption
const savedCardsStore: Map<string, SavedCard[]> = new Map();

/**
 * Save a card for later use
 * In production:
 * - Encrypt card data before storing
 * - Never store full card number, CVC
 * - Use tokenization services like Stripe, PayPal
 */
export const handleSaveCard: RequestHandler = (req, res) => {
  try {
    const { cardholderName, cardNumber, expiryDate, isDefault } =
      req.body as SaveCardRequest;
    const userId = req.headers["x-user-id"] as string || "demo-user";

    // Validate
    if (!cardholderName || !cardNumber || !expiryDate) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      } as CardManagementResponse);
      return;
    }

    // Extract last 4 digits
    const lastFourDigits = cardNumber.replace(/\s/g, "").slice(-4);

    // Create saved card (never store full number or CVC in production)
    const savedCard: SavedCard = {
      id: `card-${Date.now()}`,
      lastFourDigits,
      cardholderName,
      expiryDate,
      isDefault: isDefault || false,
      createdAt: new Date().toISOString(),
    };

    // Get existing cards for user
    const userCards = savedCardsStore.get(userId) || [];

    // If marking as default, unmark others
    if (isDefault) {
      userCards.forEach((card) => {
        card.isDefault = false;
      });
    }

    userCards.push(savedCard);
    savedCardsStore.set(userId, userCards);

    res.json({
      success: true,
      message: "Card saved successfully",
      data: userCards,
    } as CardManagementResponse);
  } catch (error) {
    console.error("Error saving card:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save card",
    } as CardManagementResponse);
  }
};

/**
 * Get all saved cards for a user
 */
export const handleGetSavedCards: RequestHandler = (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string || "demo-user";
    const userCards = savedCardsStore.get(userId) || [];

    res.json({
      success: true,
      message: "Cards retrieved successfully",
      data: userCards,
    } as CardManagementResponse);
  } catch (error) {
    console.error("Error retrieving cards:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cards",
    } as CardManagementResponse);
  }
};

/**
 * Delete a saved card
 */
export const handleDeleteCard: RequestHandler = (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.headers["x-user-id"] as string || "demo-user";

    if (!cardId) {
      res.status(400).json({
        success: false,
        message: "Card ID is required",
      } as CardManagementResponse);
      return;
    }

    const userCards = savedCardsStore.get(userId) || [];
    const filtered = userCards.filter((card) => card.id !== cardId);
    savedCardsStore.set(userId, filtered);

    res.json({
      success: true,
      message: "Card deleted successfully",
      data: filtered,
    } as CardManagementResponse);
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete card",
    } as CardManagementResponse);
  }
};

/**
 * Set a card as default
 */
export const handleSetDefaultCard: RequestHandler = (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.headers["x-user-id"] as string || "demo-user";

    if (!cardId) {
      res.status(400).json({
        success: false,
        message: "Card ID is required",
      } as CardManagementResponse);
      return;
    }

    const userCards = savedCardsStore.get(userId) || [];
    userCards.forEach((card) => {
      card.isDefault = card.id === cardId;
    });
    savedCardsStore.set(userId, userCards);

    res.json({
      success: true,
      message: "Default card updated successfully",
      data: userCards,
    } as CardManagementResponse);
  } catch (error) {
    console.error("Error setting default card:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set default card",
    } as CardManagementResponse);
  }
};
