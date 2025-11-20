import FormError from "@/components/common/FormError";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/export/Icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/auth/useSignup";
import {
  initialSignupCredentials,
  SignupFormData,
  signupSchema,
} from "@/validations/signupValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

const SignupPage = () => {
  const { handleSignup, isLoading } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: initialSignupCredentials,
  });

  const onSubmit = async (data: SignupFormData) => {
    await handleSignup(data);
  };

  return (
    <div className="flex justify-center items-center min-h-dvh p-6 md:p-10">
      <div className="max-w-sm w-full">
        <Card className="gap-4">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center text-2xl font-bold">Signup</h1>
            </CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground ">
              Enter your details to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register("firstName")} required />
                  <FormError error={errors.firstName} />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    {...register("lastName")}
                  />
                  <FormError error={errors.lastName} />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    required
                  />
                  <FormError error={errors.email} />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" {...register("username")} required />
                  <FormError error={errors.username} />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    {...register("password")}
                    type="password"
                    required
                  />
                  <FormError error={errors.password} />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    type="password"
                    required
                  />
                  <FormError error={errors.confirmPassword} />
                </div>
                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Icons.Spinner className="animate-spin" />
                    ) : (
                      "Signup"
                    )}
                  </Button>
                  <Button type="button" disabled={isLoading} variant="outline">
                    <Icons.Google className="mr-2" /> Continue with Google
                  </Button>
                  <Button type="button" disabled={isLoading} variant="outline">
                    <Icons.Twitter className="mr-2" /> Continue with X
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
