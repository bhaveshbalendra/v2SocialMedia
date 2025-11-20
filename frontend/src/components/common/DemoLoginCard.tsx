import { Icons } from "@/components/export/Icons";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { PATH } from "@/routes/pathConstants";
import { AlertCircle, LogIn, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const DemoLoginCard = () => {
  const { handleLogin, isLoading } = useLogin();
  const navigate = useNavigate();
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

  const handleGoToLogin = () => {
    navigate(PATH.LOGIN);
  };

  return (
    <Card className="max-w-xl mx-auto mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">
            Try Our Demo Account
          </CardTitle>
        </div>
        <CardDescription className="text-sm">
          Experience the full application without creating an account. Use our
          demo credentials to explore all features instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-background/50 rounded-lg p-3 border border-primary/10">
          <p className="text-sm font-medium mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs font-mono">
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              <span className="font-semibold">demo@email.com</span>
            </p>
            <p>
              <span className="text-muted-foreground">Password:</span>{" "}
              <span className="font-semibold">demos1234</span>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-900">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-300">
            <strong>Disclaimer:</strong> This is a demo account for testing
            purposes only. No account creation is required. All data is shared
            and may be reset periodically. Please do not use this account for
            personal or sensitive information.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full sm:flex-1"
          size="sm"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Icons.Spinner className="h-4 w-4 animate-spin" />
              Logging in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Click Here to Auto-Login
            </span>
          )}
        </Button>
        <Button
          onClick={handleGoToLogin}
          variant="outline"
          className="w-full sm:flex-1"
          size="sm"
        >
          Go to Login Page
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DemoLoginCard;

