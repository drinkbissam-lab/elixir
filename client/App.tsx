import "./global.css";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLanguage } from "./hooks/use-language";
import { AuthProvider } from "./hooks/use-auth";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DrinkDetail from "./pages/DrinkDetail";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { mounted } = useLanguage();

  useEffect(() => {
    // Initialize language settings on app load
    const savedLanguage = localStorage.getItem("language") || "ar";
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("data-language", savedLanguage);
    htmlElement.setAttribute("lang", savedLanguage);
    htmlElement.setAttribute("dir", savedLanguage === "ar" ? "rtl" : "ltr");
  }, []);

  useEffect(() => {
    // Initialize and sync font size from settings
    const syncFontSize = () => {
      try {
        const appSettings = localStorage.getItem("app_settings");
        let fontSize = "medium";

        if (appSettings) {
          const parsed = JSON.parse(appSettings);
          fontSize = parsed.fontSize || "medium";
        }

        const htmlElement = document.documentElement;
        htmlElement.setAttribute("data-font-size", fontSize);
      } catch (error) {
        console.error("Failed to load font size settings:", error);
        document.documentElement.setAttribute("data-font-size", "medium");
      }
    };

    syncFontSize();

    // Listen for storage changes (from other tabs/settings updates)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "app_settings" && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          const fontSize = parsed.fontSize || "medium";
          document.documentElement.setAttribute("data-font-size", fontSize);
        } catch (error) {
          console.error("Failed to update font size from storage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Handle back button navigation
    // Push initial state if not already present
    if (!window.history.state) {
      window.history.pushState({ appInitialized: true }, "");
    }

    const handlePopState = (event: PopStateEvent) => {
      // Allow back navigation within the app
      // This prevents the app from exiting on the first back press
      if (!event.state?.appInitialized) {
        // User is trying to go back beyond the app, prevent default behavior
        window.history.pushState({ appInitialized: true }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/drink/:id" element={<DrinkDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/account" element={<Account />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <TooltipProvider>
              <AppContent />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
