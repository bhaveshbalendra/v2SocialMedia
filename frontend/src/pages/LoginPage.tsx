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
import { auth, provider } from "@/utils/firebase_googleLogin";
import {
  initialLoginCredentials,
  LoginFormData,
  loginSchema,
} from "@/validations/loginValidators";
import { zodResolver } from "@hookform/resolvers/zod";
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
      <div className="max-w-sm w-full">
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
                  {errors.email_or_username && (
                    <span className="text-red-500 text-sm">
                      {errors.email_or_username.message}
                    </span>
                  )}
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
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password.message}
                    </span>
                  )}
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
                  <Button type="button" disabled={isLoading} variant="outline">
                    <Icons.Twitter className="mr-2" /> Login with X
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
