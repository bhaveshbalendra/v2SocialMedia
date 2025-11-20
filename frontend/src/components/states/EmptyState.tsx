import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

/**
 * Reusable component for displaying empty states
 * Provides consistent styling and messaging when no data is available
 */
const EmptyState = ({
  title = "No items found",
  description = "There are no items to display at this time.",
  icon,
  className,
  action,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      {icon || (
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;

