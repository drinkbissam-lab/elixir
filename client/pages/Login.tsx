import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { signIn, signUp, resetPasswordForEmail } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: t("error"),
        description: t("invalidEmail"),
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length < 6) {
      toast({
        title: t("error"),
        description: t("passwordTooShort"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);

      toast({
        title: t("success"),
        description: t("successLogin"),
      });

      setTimeout(() => {
        navigate("/");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: t("error"),
        description:
          error instanceof Error ? error.message : t("error"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: t("error"),
        description: t("errorNameRequired"),
        variant: "destructive",
      });
      return;
    }

    if (!email || !email.includes("@")) {
      toast({
        title: t("error"),
        description: t("invalidEmail"),
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length < 6) {
      toast({
        title: t("error"),
        description: t("passwordTooShort"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);

      toast({
        title: t("success"),
        description: t("successLogin"),
      });

      setTimeout(() => {
        navigate("/");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: t("error"),
        description:
          error instanceof Error ? error.message : t("error"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail || !forgotEmail.includes("@")) {
      toast({
        title: t("error"),
        description: t("invalidEmail"),
        variant: "destructive",
      });
      return;
    }

    setIsSendingReset(true);

    try {
      await resetPasswordForEmail(forgotEmail);

      toast({
        title: t("success"),
        description: t("successLogin"),
      });

      setShowForgotPassword(false);
      setForgotEmail("");
      setIsSendingReset(false);
    } catch (error) {
      toast({
        title: t("error"),
        description:
          error instanceof Error ? error.message : t("error"),
        variant: "destructive",
      });
      setIsSendingReset(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
              {t("resetPassword")}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {t("resetPasswordSubtitle")}
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("emailAddress")}
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder={t("enterEmail")}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={isSendingReset}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
              >
                {isSendingReset ? t("sending") : t("sendResetLink")}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail("");
                }}
                variant="outline"
                className="w-full"
              >
                {t("backToLogin")}
              </Button>
            </form>

            <p className="text-center text-muted-foreground mt-6 text-sm">
              {t("termsAccept")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
            {isSignUp ? t("signUp") : t("welcome")}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {isSignUp
              ? t("createNewAccount")
              : t("loginSubtitle")}
          </p>

          {/* Toggle between Login and Sign Up */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsSignUp(false);
                setName("");
                setEmail("");
                setPassword("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                !isSignUp
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t("signIn")}
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setName("");
                setEmail("");
                setPassword("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isSignUp
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t("signUp")}
            </button>
          </div>

          {/* Login Form */}
          {!isSignUp && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("emailAddress")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("enterEmail")}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("password")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("enterPassword")}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
              >
                {isLoading ? t("signingIn") : t("signIn")}
              </Button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {t("forgotPassword")}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {isSignUp && (
            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("enterFullName")}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("emailAddress")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("enterEmail")}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("password")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("strongPassword")}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
              >
                {isLoading ? t("signingUp") : t("signUp")}
              </Button>
            </form>
          )}

          <p className="text-center text-muted-foreground mt-6 text-sm">
            {t("termsAccept")}
          </p>
        </div>
      </div>
    </div>
  );
}
