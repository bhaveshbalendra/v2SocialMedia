import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/useSignup";
import { signupSchema } from "@/validations/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";
import { Link } from "react-router";
import { z } from "zod";

const credentials = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const { handleSignup, isLoading } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: credentials,
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
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    required
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" {...register("username")} required />
                  {errors.username && (
                    <span className="text-red-500 text-sm">
                      {errors.username.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    {...register("password")}
                    type="password"
                    required
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    type="password"
                    required
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" className="h-3 w-3" />
                  <Label htmlFor="terms">
                    I agree to the
                    <Link to="/terms" className="text-blue-500 underline">
                      terms and conditions
                    </Link>
                  </Label>
                </div>
                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <ImSpinner2 className="animate-spin" />
                    ) : (
                      "Signup"
                    )}
                  </Button>
                  <Button type="button" disabled={isLoading}>
                    <FaGoogle /> Continue with Google
                  </Button>
                  <Button type="button" disabled={isLoading}>
                    <FaXTwitter /> Continue with X
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
