import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/lib/supabase";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { verifyOtp } = useAuth();
  const { t } = useLanguage();

  const email = (location.state as { email?: string })?.email || "";

  if (!email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
              {t("errorTitle")}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {t("emailNotFoundError")}
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
            >
              {t("backToLogin")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length < 6) {
      toast({
        title: t("errorTitle"),
        description: t("invalidOtpError"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await verifyOtp(email, otp, "signup");

      toast({
        title: t("verificationSuccess"),
        description: t("verificationSuccessDesc"),
      });

      setTimeout(() => {
        navigate("/");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description:
          error instanceof Error ? error.message : t("verificationFailed"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: t("errorTitle"),
        description: t("noEmailErrorDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);

    try {
      // Resend OTP using Supabase
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/verify-email` } });

      if (error) {
        throw error;
      }

      toast({
        title: t("resendCodeSuccess"),
        description: t("resendCodeDesc"),
      });

      // Start cooldown timer (60 seconds)
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setIsResending(false);
    } catch (error) {
      console.error("Error resending code:", error);
      toast({
        title: t("errorTitle"),
        description:
          error instanceof Error ? error.message : t("resendCodeError"),
        variant: "destructive",
      });
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
            {t("verifyEmail")}
          </h1>
          <p className="text-muted-foreground text-center mb-4">
            {t("verificationCodeSent")}
          </p>
          <p className="text-foreground font-medium text-center mb-8 break-all">{email}</p>

          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">{t("verificationInstructions")}</span> {t("verificationInstructionsText")}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("verificationCodeLabel")}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder={t("enterCodePlaceholder")}
                maxLength={6}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
            >
              {isLoading ? t("verifyingOtp") : t("verifyButtonText")}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || resendCooldown > 0}
              variant="outline"
              className="w-full"
            >
              {isResending ? t("sending") : resendCooldown > 0 ? `${t("resendCodeCooldown")} ${resendCooldown}${t("resendCodeCooldown").includes("{seconds}") ? "" : "s"}` : t("resendButtonText")}
            </Button>

            <Button
              type="button"
              onClick={() => navigate("/login")}
              variant="ghost"
              className="w-full"
            >
              {t("backToLogin")}
            </Button>
          </div>

          <p className="text-center text-muted-foreground mt-6 text-xs">
            {t("didNotReceiveSpamHint")}
          </p>
        </div>
      </div>
    </div>
  );
}
