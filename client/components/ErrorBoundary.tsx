import React, { ReactNode, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

interface Props {
  children: ReactNode;
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
}

function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md bg-card rounded-2xl shadow-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("oopsError")}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("unexpectedError")}
        </p>

        {process.env.NODE_ENV === "development" && error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <p className="text-sm text-red-900 dark:text-red-100 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={onReset}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {t("tryAgainButton")}
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="flex-1"
          >
            {t("goHomeButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default class ErrorBoundary extends React.Component<Props, ErrorState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}
