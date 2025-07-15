/**
 * ErrorDisplay Component
 *
 * Reusable component for displaying form validation errors with consistent styling
 *
 * @component
 * @example
 * <ErrorDisplay error={errors.title} />
 */
interface ErrorDisplayProps {
  error?: {
    message?: string;
  };
  className?: string;
}

const ErrorDisplay = ({
  error,
  className = "",
}: ErrorDisplayProps): React.ReactElement | null => {
  // Condition: Only render if error exists and has a message
  if (!error?.message) {
    return null;
  }

  return (
    <p className={`text-sm text-destructive ${className}`}>{error.message}</p>
  );
};

export default ErrorDisplay;
