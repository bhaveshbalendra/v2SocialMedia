import FormError from "@/components/common/FormError";
import DemoLoginCard from "@/components/common/DemoLoginCard";
import { Icons } from "@/components/export/Icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoogleLoginSignup } from "@/hooks/auth/useGoogleLoginSignup";
import { useLogin } from "@/hooks/auth/useLogin";
import { PATH } from "@/routes/pathConstants";
import { auth, provider } from "@/utils/firebase_googleLogin";
import {
  initialLoginCredentials,
  LoginFormData,
  loginSchema,
} from "@/validations/loginValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Home } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

const LoginPage = () => {
  const { handleLogin, isLoading } = useLogin();
  const { handleGoogleAuth } = useGoogleLoginSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialLoginCredentials,
  });

  const handleGoogleLogin = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const nameParts = user.displayName
        ? user.displayName.split(" ")
        : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || ""; // Handles middle names
      const email = user.email!;

      await handleGoogleAuth({
        uid: user.uid, // Firebase UID
        firstName,
        lastName,
        email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    await handleLogin(data);
  };

  return (
    <div className="flex justify-center items-center min-h-dvh p-6 md:p-10">
      <div className="max-w-sm w-full space-y-4">
        {/* Go Home Button */}
        <div className="flex justify-start">
          <Link to={PATH.HOME}>
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Demo Account Info Card */}
        <DemoLoginCard />

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center text-2xl font-bold">Login</h1>
            </CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground ">
              Enter your details to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="email_or_username">Email</Label>
                  <Input
                    id="email_or_username"
                    placeholder="Enter your email or username"
                    type="text"
                    {...register("email_or_username")}
                    autoComplete="current-password"
                    required
                  />
                  <FormError error={errors.email_or_username} />
                </div>

                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    {...register("password")}
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                  />
                  <FormError error={errors.password} />
                </div>

                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Icons.Spinner className="animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <Button
                    onClick={handleGoogleLogin}
                    type="button"
                    disabled={isLoading}
                    variant="outline"
                  >
                    <Icons.Google className="mr-2" /> Login with Google
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
            <div className="mt-4 flex items-start gap-1.5 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900">
              <AlertCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-tight">
                Takes about 50 seconds to restart. If slow, refresh the page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
