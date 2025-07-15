import { Icons } from "@/components/export/Icons";
import { Button } from "@/components/ui/button";

/**
 * SubmitButton Component
 *
 * Renders either a loading spinner or submit button based on loading state
 *
 * @component
 * @example
 * <SubmitButton isLoading={isLoading} />
 */
interface SubmitButtonProps {
  isLoading: boolean;
  text?: string;
  className?: string;
}

const SubmitButton = ({
  isLoading,
  text = "Submit",
  className = "w-full",
}: SubmitButtonProps): React.ReactElement => {
  if (isLoading) {
    return <Icons.Spinner className="animate-spin mt-3" />;
  } else {
    return (
      <Button type="submit" className={className}>
        {text}
      </Button>
    );
  }
};

export default SubmitButton;
