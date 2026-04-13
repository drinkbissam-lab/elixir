import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/lib/supabase"; // تأكد أن المسار صحيح

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { updatePassword } = useAuth();
  const { t } = useLanguage();

  // ================================================
  // ضبط الجلسة تلقائيًا إذا جاءنا access_token و refresh_token من Supabase OAuth
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth.setSession({
          access_token,
          refresh_token,
        }).then(({ error }) => {
          if (error) {
            console.error("خطأ أثناء تعيين الجلسة:", error.message);
            toast({
              title: t("errorTitle"),
              description: t("sessionSetError"),
              variant: "destructive",
            });
          } else {
            console.log("تم تسجيل الدخول بنجاح!");
            toast({
              title: t("sessionSetSuccess"),
              description: t("loggedInSuccessfully"),
            });
          }
        });
      }
    }
  }, [toast, t]);
  // ================================================

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast({
        title: t("errorTitle"),
        description: t("passwordTooShortError"),
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: t("errorTitle"),
        description: t("passwordMismatchError"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(password);

      toast({
        title: t("passwordUpdateSuccess"),
        description: t("passwordUpdateSuccessDesc"),
      });

      setTimeout(() => {
        navigate("/login");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description:
          error instanceof Error
            ? error.message
            : t("passwordUpdateError"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
            {t("resetPasswordHeading")}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {t("resetPasswordSubtitleText")}
          </p>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("enterNewPasswordLabel")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("enterNewPassword")}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("confirmPasswordLabel")}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("enterConfirmNewPassword")}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
            >
              {isLoading ? t("updatingPassword") : t("setPasswordBtn")}
            </Button>

            <Button
              type="button"
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full"
            >
              {t("backToLogin")}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6 text-sm">
            {t("passwordSecurityHint")}
          </p>
        </div>
      </div>
    </div>
  );
}