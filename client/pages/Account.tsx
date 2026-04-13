import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Settings,
  ShoppingBag,
  Bell,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { getOrders, LocalOrder } from "@/lib/orders";


interface SavedAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

interface SavedCard {
  id: string;
  lastFourDigits: string;
  cardholderName: string;
  expiryDate: string;
  isDefault: boolean;
  createdAt: string;
}

export default function Account() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  // User data
  const [userPhone, setUserPhone] = useState("");

  // UI states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "cards" | "settings">("profile");

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressText, setNewAddressText] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCvc, setNewCardCvc] = useState("");

  // Data
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Load user data
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const phone = localStorage.getItem("userPhone") || "";

    setEditName(name);
    setEditPhone(phone);

    setOrders(getOrders(user.id));

    // Load saved addresses
    const savedAddrs = localStorage.getItem("savedAddresses");
    if (savedAddrs) {
      setSavedAddresses(JSON.parse(savedAddrs));
    }

    // Load notification settings
    const notifSetting = localStorage.getItem("notificationsEnabled");
    if (notifSetting) {
      setNotificationsEnabled(JSON.parse(notifSetting));
    }

    // Load saved cards
    const loadSavedCards = async () => {
      try {
        const response = await fetch("/api/cards", {
          headers: {
            "x-user-id": user.id,
          },
        });
        const data = await response.json();
        if (data.success && data.data) {
          setSavedCards(data.data);
        }
      } catch (error) {
        console.error("Error loading saved cards:", error);
      }
    };

    loadSavedCards();
  }, [navigate, user]);

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      toast({
        title: "خطأ",
        description: "الاسم لا يمكن أن يكون فارغاً",
        variant: "destructive",
      });
      return;
    }

    if (!editPhone || editPhone.length < 10) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم جوال صحيح",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("userPhone", editPhone);
    setUserPhone(editPhone);
    setIsEditingProfile(false);

    toast({
      title: "نجح",
      description: "تم تحديث بيانات حسابك بنجاح",
    });
  };

  const handleAddAddress = () => {
    if (!newAddressLabel.trim() || !newAddressText.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      label: newAddressLabel,
      address: newAddressText,
      isDefault: savedAddresses.length === 0,
    };

    const updated = [...savedAddresses, newAddress];
    setSavedAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));

    setNewAddressLabel("");
    setNewAddressText("");
    setIsAddingAddress(false);

    toast({
      title: "نجح",
      description: "تم إضافة العنوان بنجاح",
    });
  };

  const handleDeleteAddress = (id: string) => {
    const updated = savedAddresses.filter((addr) => addr.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));

    toast({
      description: "تم حذف العنوان",
    });
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = savedAddresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setSavedAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
  };

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("userPhone");
      toast({
        title: t("success"),
        description: "Goodbye!",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notificationsEnabled", JSON.stringify(newValue));

    toast({
      description: newValue ? t("notificationsEnabled") : t("notificationsDisabled"),
    });
  };

  const handleAddCard = async () => {
    if (!newCardName.trim() || !newCardNumber || !newCardExpiry || !newCardCvc) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع حقول البطاقة",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify({
          cardholderName: newCardName,
          cardNumber: newCardNumber,
          expiryDate: newCardExpiry,
          cvc: newCardCvc,
          isDefault: savedCards.length === 0,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setSavedCards(data.data);
        setNewCardName("");
        setNewCardNumber("");
        setNewCardExpiry("");
        setNewCardCvc("");
        setIsAddingCard(false);
        toast({
          title: "نجح",
          description: "تم حفظ البطاقة بنجاح",
        });
      }
    } catch (error) {
      console.error("Error saving card:", error);
      toast({
        title: "خطأ",
        description: "فشل حفظ البطاقة",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user?.id || "",
        },
      });

      const data = await response.json();
      if (data.success && data.data) {
        setSavedCards(data.data);
        toast({
          description: "تم حذف البطاقة",
        });
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      toast({
        title: "خطأ",
        description: "فشل حذف البطاقة",
        variant: "destructive",
      });
    }
  };

  const handleSetDefaultCard = async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}/default`, {
        method: "PATCH",
        headers: {
          "x-user-id": user?.id || "",
        },
      });

      const data = await response.json();
      if (data.success && data.data) {
        setSavedCards(data.data);
        toast({
          description: "تم تحديث البطاقة الافتراضية",
        });
      }
    } catch (error) {
      console.error("Error setting default card:", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث البطاقة الافتراضية",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header with user avatar and name */}
        <div className="bg-card rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
              </h1>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{userPhone || t("notSet")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={async () => {
                try {
                  await signOut();
                  navigate("/");
                } catch (error) {
                  toast({
                    title: "خطأ",
                    description: "حدث خطأ أثناء تسجيل الخروج",
                    variant: "destructive",
                  });
                }
              }}
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل خروج
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {(["profile", "orders", "addresses", "cards", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              {tab === "profile" && "البروفايل"}
              {tab === "orders" && "الطلبات"}
              {tab === "addresses" && "العناوين"}
              {tab === "cards" && "البطاقات"}
              {tab === "settings" && "الإعدادات"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">{t("accountData")}</h2>
              {!isEditingProfile && (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  variant="outline"
                >
                  <Edit2 className="w-4 h-4 ml-2" />
                  {t("edit")}
                </Button>
              )}
            </div>

            {isEditingProfile ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    رقم الجوال
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
              onClick={handleSaveProfile}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 ml-2" />
              {t("save")}
            </Button>
            <Button
              onClick={() => {
                setIsEditingProfile(false);
                setEditName(user?.user_metadata?.full_name || user?.email?.split("@")[0] || "");
                setEditPhone(userPhone);
              }}
              variant="outline"
            >
              <X className="w-4 h-4 ml-2" />
              {t("cancel")}
            </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t("name")}</p>
                  <p className="text-lg font-semibold text-foreground">{user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t("phoneNumber")}</p>
                  <p className="text-lg font-semibold text-foreground">{userPhone || "غير محدد"}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t("emailIdentifier")}</p>
                  <p className="text-lg font-semibold text-foreground">{user?.email}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">سجل الطلبات</h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد طلبات حتى الآن</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">الطلب #{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                        <p className="text-sm text-muted-foreground">
                          حالة الدفع: {order.payment_status === "paid" ? t("completed") : order.payment_status === "pending" ? t("pending") : order.payment_status === "cancelled" ? t("cancelled") : "Failed"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.payment_status === "paid"
                              ? "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
                              : order.payment_status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100"
                              : "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100"
                          }`}
                        >
                          {order.payment_status === "paid"
                            ? t("completed")
                            : order.payment_status === "pending"
                            ? t("pending")
                            : order.payment_status === "cancelled"
                            ? t("cancelled")
                            : "Failed"}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{order.items}</p>

                    <div className="flex items-center justify-between">
                      <p className="font-bold text-primary">د.م. {order.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">العناوين المحفوظة</h2>
              {!isAddingAddress && (
                <Button
                  onClick={() => setIsAddingAddress(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة عنوان
                </Button>
              )}
            </div>

            {isAddingAddress && (
              <div className="mb-8 p-6 bg-muted rounded-lg">
                <h3 className="font-bold text-foreground mb-4">عنوان جديد</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      اسم العنوان (مثل: المنزل، العمل)
                    </label>
                    <input
                      type="text"
                      value={newAddressLabel}
                      onChange={(e) => setNewAddressLabel(e.target.value)}
                      placeholder="المنزل"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      العنوان الكامل
                    </label>
                    <textarea
                      value={newAddressText}
                      onChange={(e) => setNewAddressText(e.target.value)}
                      placeholder="الشارع، المنطقة، الرقم..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddAddress}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Save className="w-4 h-4 ml-2" />
                      حفظ العنوان
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingAddress(false);
                        setNewAddressLabel("");
                        setNewAddressText("");
                      }}
                      variant="outline"
                    >
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {savedAddresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد عناوين محفوظة</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      address.isDefault
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-foreground text-lg">
                          {address.label}
                        </p>
                        {address.isDefault && (
                          <p className="text-xs text-primary font-semibold">
                            العنوان الافتراضي
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!address.isDefault && (
                          <Button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            size="sm"
                            variant="outline"
                          >
                            اجعله افتراضياً
                          </Button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-foreground whitespace-pre-wrap">
                      {address.address}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cards Tab */}
        {activeTab === "cards" && (
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">البطاقات المحفوظة</h2>
              {!isAddingCard && (
                <Button
                  onClick={() => setIsAddingCard(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة بطاقة
                </Button>
              )}
            </div>

            {isAddingCard && (
              <div className="mb-8 p-6 bg-muted rounded-lg">
                <h3 className="font-bold text-foreground mb-4">بطاقة جديدة</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      اسم صاحب البطاقة
                    </label>
                    <input
                      type="text"
                      value={newCardName}
                      onChange={(e) => setNewCardName(e.target.value)}
                      placeholder="Ahmed Mohammed"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      رقم البطاقة
                    </label>
                    <input
                      type="text"
                      value={newCardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, "");
                        if (value.length <= 16) {
                          setNewCardNumber(value.replace(/(\d{4})/g, "$1 ").trim());
                        }
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        تاريخ الصلاحية
                      </label>
                      <input
                        type="text"
                        value={newCardExpiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                          }
                          setNewCardExpiry(value);
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        رمز الأمان
                      </label>
                      <input
                        type="text"
                        value={newCardCvc}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 3) {
                            setNewCardCvc(value);
                          }
                        }}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddCard}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Save className="w-4 h-4 ml-2" />
                      حفظ البطاقة
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingCard(false);
                        setNewCardName("");
                        setNewCardNumber("");
                        setNewCardExpiry("");
                        setNewCardCvc("");
                      }}
                      variant="outline"
                    >
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {savedCards.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد بطاقات محفوظة</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      card.isDefault
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-foreground text-lg">
                          {card.cardholderName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ****{card.lastFourDigits}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          الصلاحية: {card.expiryDate}
                        </p>
                        {card.isDefault && (
                          <p className="text-xs text-primary font-semibold mt-2">
                            البطاقة الافتراضية
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!card.isDefault && (
                          <Button
                            onClick={() => handleSetDefaultCard(card.id)}
                            size="sm"
                            variant="outline"
                          >
                            اجعلها افتراضية
                          </Button>
                        )}
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">الإعدادات</h2>

            <div className="space-y-6">
              {/* Notifications Setting */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        الإشعارات
                      </p>
                      <p className="text-sm text-muted-foreground">
                        تلقي إشعارات عن حالة الطلبات والعروض الخاصة
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleNotifications}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      notificationsEnabled
                        ? "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {notificationsEnabled ? "مفعّل" : "معطّل"}
                  </button>
                </div>
              </div>

              {/* Account Info */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      معلومات التطبيق
                    </p>
                    <p className="text-sm text-muted-foreground">
                      الإصدار: 1.0.0
                    </p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
                <p className="font-bold text-red-900 dark:text-red-100 mb-4">
                  منطقة الخطر
                </p>
                <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                  حذف حسابك بشكل دائم لن يمكن استرجاعه
                </p>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  حذف الحساب
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
