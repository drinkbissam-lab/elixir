import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSendOrderEmail } from "./routes/email";
import {
  handleSaveCard,
  handleGetSavedCards,
  handleDeleteCard,
  handleSetDefaultCard,
} from "./routes/cards";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Order confirmation email route
  app.post("/api/send-order-email", handleSendOrderEmail);

  // Card management routes
  app.post("/api/cards", handleSaveCard);
  app.get("/api/cards", handleGetSavedCards);
  app.delete("/api/cards/:cardId", handleDeleteCard);
  app.patch("/api/cards/:cardId/default", handleSetDefaultCard);

  return app;
}
