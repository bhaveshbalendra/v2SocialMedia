import { cn } from "@/lib/utils";

interface FormErrorProps {
  error?: {
    message?: string;
  };
  className?: string;
}

/**
 * Reusable component for displaying form validation errors with consistent styling
 * Uses theme-aware destructive color instead of hardcoded red
 */
const FormError = ({ error, className }: FormErrorProps) => {
  if (!error?.message) {
    return null;
  }

  return (
    <p className={cn("text-sm text-destructive", className)}>
      {error.message}
    </p>
  );
};

export default FormError;

