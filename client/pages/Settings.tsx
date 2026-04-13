import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Bell,
  MapPin,
  Heart,
  RotateCcw,
  LogOut,
  ChevronRight,
  User,
  Phone,
  Lock,
  Zap,
  HelpCircle,
  Trash2,
  RefreshCw,
  MessageSquare,
  Mail,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useLanguage, type Language } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from 'next-themes';
import { useSettings } from '@/hooks/use-settings';
import { useToast } from '@/hooks/use-toast';
import SettingsRow from '@/components/SettingsRow';
import EditSettingDialog from '@/components/EditSettingDialog';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const {
    settings,
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
  } = useSettings();

  // Dialog states
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editPhoneOpen, setEditPhoneOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [editNotesOpen, setEditNotesOpen] = useState(false);

  // Handle font size change with immediate UI update
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    updateFontSize(size);
    // Apply immediately to html element for instant visual feedback
    document.documentElement.setAttribute('data-font-size', size);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: t('logoutSuccess'),
        description: t('logoutSuccessDesc'),
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: t('error'),
        description: t('logoutErrorDesc'),
        variant: 'destructive',
      });
    }
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    toast({
      title: t('success'),
      description: t('cacheClearedSuccess'),
    });
  };

  const handleReloadApp = () => {
    window.location.reload();
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const displayName = settings.fullName || user?.email?.split('@')[0] || t('error');

  return (
    <div className="min-h-screen bg-background pb-12 sm:pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 flex items-start gap-3">
          <SettingsIcon className="mt-1 h-8 w-8 text-primary flex-shrink-0" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">{t('settings')}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {t('hello')} {displayName}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* ACCOUNT SECTION */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{t('account')}</h2>
            </div>

            <div className="space-y-1">
              <SettingsRow
                icon={<User className="h-5 w-5" />}
                label={t('fullNameLabel')}
                description={settings.fullName || t('notSet')}
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditNameOpen(true)}
                    className="text-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                }
              />

              <SettingsRow
                icon={<Phone className="h-5 w-5" />}
                label={t('phoneNumberLabel')}
                description={settings.phoneNumber || t('notSet')}
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditPhoneOpen(true)}
                    className="text-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                }
              />

              <SettingsRow
                icon={<LogOut className="h-5 w-5 text-red-500" />}
                label={t('logoutLabel')}
                description={t('logoutDesc')}
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </div>

          {/* APP PREFERENCES SECTION */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{t('appPreferences')}</h2>
            </div>

            <div className="space-y-1">
              <SettingsRow
                icon={<Globe className="h-5 w-5" />}
                label={t('language')}
                description={
                  languages.find((l) => l.code === language)?.label || 'العربية'
                }
                action={
                  <div className="flex gap-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          language === lang.code
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {lang.flag}
                      </button>
                    ))}
                  </div>
                }
              />

              <SettingsRow
                icon={theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                label={t('theme')}
                description={theme === 'dark' ? t('nightMode') : t('dayMode')}
                action={
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="rounded-full bg-muted p-2 hover:bg-muted/80 transition-colors"
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Moon className="h-4 w-4 text-slate-600" />
                    )}
                  </button>
                }
              />

              <SettingsRow
                label={t('fontSize')}
                description={
                  settings.fontSize === 'small'
                    ? t('small')
                    : settings.fontSize === 'large'
                      ? t('large')
                      : t('medium')
                }
                action={
                  <div className="flex gap-1">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => handleFontSizeChange(size)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          settings.fontSize === size
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {size === 'small' ? 'S' : size === 'large' ? 'L' : 'M'}
                      </button>
                    ))}
                  </div>
                }
              />

              <SettingsRow
                label={t('layoutDirection')}
                description={settings.rtlLayout ? t('rightToLeft') : t('leftToRight')}
                action={
                  <Switch
                    checked={settings.rtlLayout}
                    onCheckedChange={toggleRtlLayout}
                  />
                }
              />
            </div>
          </div>

          {/* NOTIFICATIONS SECTION */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{t('notificationsSection')}</h2>
            </div>

            <div className="space-y-1">
              <SettingsRow
                label={t('enableNotifications')}
                description={t('allowAllNotifications')}
                action={
                  <Switch
                    checked={settings.notificationsEnabled}
                    onCheckedChange={toggleNotifications}
                  />
                }
              />

              {settings.notificationsEnabled && (
                <>
                  <SettingsRow
                    label={t('orderNotifications')}
                    description={t('orderNotificationsDesc')}
                    action={
                      <Switch
                        checked={settings.orderNotifications}
                        onCheckedChange={toggleOrderNotifications}
                      />
                    }
                  />

                  <SettingsRow
                    label={t('offersNotifications')}
                    description={t('offersNotificationsDesc')}
                    action={
                      <Switch
                        checked={settings.offersNotifications}
                        onCheckedChange={toggleOffersNotifications}
                      />
                    }
                  />
                </>
              )}
            </div>
          </div>

          {/* DELIVERY SECTION */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{t('deliverySection')}</h2>
            </div>

            <div className="space-y-1">
              <SettingsRow
                label={t('defaultAddressLabel')}
                description={settings.defaultAddress || t('notSet')}
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditAddressOpen(true)}
                    className="text-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                }
              />

              <SettingsRow
                label={t('deliveryNotes')}
                description={settings.deliveryNotes ? t('notesSet') : t('notSet')}
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditNotesOpen(true)}
                    className="text-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </div>

          {/* USER EXPERIENCE SECTION */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Heart className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{t('userExperienceSection')}</h2>
            </div>

            <div className="space-y-1">
              <SettingsRow
                label={t('favorites')}
                description={t('favoritesDesc')}
                action={
                  <Switch
                    checked={settings.favoritesEnabled}
                    onCheckedChange={toggleFavorites}
                  />
                }
              />

              <SettingsRow
                label={t('quickReorder')}
                description={t('quickReorderDesc')}
                action={
                  <Switch
                    checked={settings.quickReorder}
                    onCheckedChange={toggleQuickReorder}
                  />
                }
              />

              <SettingsRow
                label={t('saveLast')}
                description={t('saveLastDesc')}
                action={
                  <Switch
                    checked={settings.saveLastOrder}
                    onCheckedChange={toggleSaveLastOrder}
                  />
                }
              />

            </div>
          </div>

          {/* SUPPORT & HELP SECTION */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{t('supportSection')}</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleReloadApp}
                className="w-full flex items-center justify-between gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">{t('reloadApp')}</h3>
                    <p className="text-sm text-muted-foreground">{t('reloadAppDesc')}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=drinkbissam@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">{t('reportProblem')}</h3>
                    <p className="text-sm text-muted-foreground">drinkbissam@gmail.com</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=drinkbissam@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">{t('contactUs')}</h3>
                    <p className="text-sm text-muted-foreground">drinkbissam@gmail.com</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* RESET SECTION */}
          <div className="rounded-2xl border border-red-200 bg-card p-6 shadow-sm dark:border-red-800 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <RotateCcw className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold text-red-600">{t('resetSection')}</h2>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              {t('resetWarning')}
            </p>

            <Button
              onClick={resetAllSettings}
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('resetAllBtn')}
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialogs */}
      <EditSettingDialog
        open={editNameOpen}
        onOpenChange={setEditNameOpen}
        title={t('editFullName')}
        label={t('fullNameLabel')}
        value={settings.fullName}
        onSave={updateFullName}
        placeholder={t('enterFullName')}
      />

      <EditSettingDialog
        open={editPhoneOpen}
        onOpenChange={setEditPhoneOpen}
        title={t('editPhoneNumber')}
        label={t('phoneNumberLabel')}
        value={settings.phoneNumber}
        onSave={updatePhoneNumber}
        type="tel"
        placeholder={t('enterPhoneNumber')}
      />

      <EditSettingDialog
        open={editAddressOpen}
        onOpenChange={setEditAddressOpen}
        title={t('editAddress')}
        label={t('defaultAddressLabel')}
        value={settings.defaultAddress}
        onSave={updateDefaultAddress}
        type="textarea"
        placeholder={t('enterAddress')}
      />

      <EditSettingDialog
        open={editNotesOpen}
        onOpenChange={setEditNotesOpen}
        title={t('editDeliveryNotes')}
        label={t('deliveryNotes')}
        value={settings.deliveryNotes}
        onSave={updateDeliveryNotes}
        type="textarea"
        placeholder={t('enterDeliveryNotes')}
      />
    </div>
  );
}
