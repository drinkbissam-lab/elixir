import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

export type FontSize = 'small' | 'medium' | 'large';

export interface UserSettings {
  // Account
  fullName: string;
  phoneNumber: string;

  // App Preferences
  fontSize: FontSize;
  rtlLayout: boolean;

  // Notifications
  notificationsEnabled: boolean;
  orderNotifications: boolean;
  offersNotifications: boolean;

  // Delivery
  defaultAddress: string;
  deliveryNotes: string;

  // User Experience
  favoritesEnabled: boolean;
  quickReorder: boolean;
  saveLastOrder: boolean;

  // Support & Help
  cacheSize: number; // in KB
}

const DEFAULT_SETTINGS: UserSettings = {
  fullName: '',
  phoneNumber: '',
  fontSize: 'medium',
  rtlLayout: true,
  notificationsEnabled: true,
  orderNotifications: true,
  offersNotifications: true,
  defaultAddress: '',
  deliveryNotes: '',
  favoritesEnabled: true,
  quickReorder: true,
  saveLastOrder: true,
  cacheSize: 0,
};

const STORAGE_KEY = 'app_settings';

// Helper to get storage key with user ID
function getStorageKey(userId?: string): string {
  if (!userId) {
    return 'app_settings_guest';
  }
  return `app_settings_${userId}`;
}

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storageKey = getStorageKey(user?.id);
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user?.id]);

  // Save settings to localStorage whenever they change
  const saveSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        const storageKey = getStorageKey(user?.id);
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      return updated;
    });
  }, [user?.id]);

  // Individual update functions for convenience
  const updateFullName = useCallback((name: string) => {
    saveSettings({ fullName: name });
  }, [saveSettings]);

  const updatePhoneNumber = useCallback((phone: string) => {
    saveSettings({ phoneNumber: phone });
  }, [saveSettings]);

  const updateFontSize = useCallback((size: FontSize) => {
    saveSettings({ fontSize: size });
  }, [saveSettings]);

  const toggleRtlLayout = useCallback(() => {
    setSettings((prev) => {
      const newRtl = !prev.rtlLayout;
      const updated = { ...prev, rtlLayout: newRtl };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      return updated;
    });
  }, []);

  const toggleNotifications = useCallback(() => {
    saveSettings({ notificationsEnabled: !settings.notificationsEnabled });
  }, [settings.notificationsEnabled, saveSettings]);

  const toggleOrderNotifications = useCallback(() => {
    saveSettings({ orderNotifications: !settings.orderNotifications });
  }, [settings.orderNotifications, saveSettings]);

  const toggleOffersNotifications = useCallback(() => {
    saveSettings({ offersNotifications: !settings.offersNotifications });
  }, [settings.offersNotifications, saveSettings]);

  const updateDefaultAddress = useCallback((address: string) => {
    saveSettings({ defaultAddress: address });
  }, [saveSettings]);

  const updateDeliveryNotes = useCallback((notes: string) => {
    saveSettings({ deliveryNotes: notes });
  }, [saveSettings]);

  const toggleFavorites = useCallback(() => {
    saveSettings({ favoritesEnabled: !settings.favoritesEnabled });
  }, [settings.favoritesEnabled, saveSettings]);

  const toggleQuickReorder = useCallback(() => {
    saveSettings({ quickReorder: !settings.quickReorder });
  }, [settings.quickReorder, saveSettings]);

  const toggleSaveLastOrder = useCallback(() => {
    saveSettings({ saveLastOrder: !settings.saveLastOrder });
  }, [settings.saveLastOrder, saveSettings]);

  const resetAllSettings = useCallback(() => {
    const storageKey = getStorageKey(user?.id);
    localStorage.removeItem(storageKey);
    setSettings(DEFAULT_SETTINGS);
  }, [user?.id]);

  return {
    settings,
    isLoading,
    saveSettings,
    updateFullName,
    updatePhoneNumber,
    updateFontSize,
    toggleRtlLayout,
    toggleNotifications,
    toggleOrderNotifications,
    toggleOffersNotifications,
    updateDefaultAddress,
    updateDeliveryNotes,
    toggleFavorites,
    toggleQuickReorder,
    toggleSaveLastOrder,
    resetAllSettings,
  };
}
