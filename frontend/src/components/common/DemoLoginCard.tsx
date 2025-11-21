import { Icons } from "@/components/export/Icons";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { AlertCircle, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const DemoLoginCard = () => {
  const { handleLogin, isLoading } = useLogin();
  const user = useAppSelector((state) => state.auth.user);

  // Don't show if user is already logged in
  if (user) {
    return null;
  }

  const handleDemoLogin = async () => {
    await handleLogin({
      email_or_username: "demo@email.com",
      password: "demos1234",
    });
  };

  return (
    <Card className="max-w-md mx-auto mb-4 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-base font-semibold">
          Fast Login Without Signup - See Full Website
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pb-3">
        <p className="text-xs text-muted-foreground">
          No account needed! Use demo credentials to explore all features
          instantly.
        </p>
        <div className="text-xs font-mono bg-background/50 rounded p-2 border">
          <p>
            Email: <span className="font-semibold">demo@email.com</span>
          </p>
          <p>
            Password: <span className="font-semibold">demos1234</span>
          </p>
        </div>
        <div className="flex items-start gap-1.5 p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900">
          <AlertCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-tight">
            <strong>Note:</strong> Backend sleeps if unused (free hosting).
            Takes about 50 seconds to restart. If slow, refresh the page.
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-3">
        <Button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full"
          size="sm"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Icons.Spinner className="h-3.5 w-3.5 animate-spin" />
              Logging in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-3.5 w-3.5" />
              Quick Login - Access Full Site
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DemoLoginCard;
