import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Reusable component for displaying error states
 * Provides consistent error messaging and optional retry functionality
 */
const ErrorDisplay = ({
  title = "Something went wrong",
  message = "An error occurred. Please try again later.",
  onRetry,
  className,
}: ErrorDisplayProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;

