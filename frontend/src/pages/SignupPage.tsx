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
import { Link } from "react-router";
import { z } from "zod";
const credentials = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const { handleSignup, error, isLoading } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: credentials,
  });

  const onSubmit = async (data: SignupFormData) => {};

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
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" required />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button type="submit">Signup</Button>
                  <Button type="button">
                    <FaGoogle /> Signup with Google
                  </Button>
                  <Button type="button">
                    <FaXTwitter /> Signup with X
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="newsletter"
                    name="newsletter"
                    className="h-3 w-3"
                  />
                  <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" name="terms" className="h-3 w-3" />
                  <Label htmlFor="terms">
                    I agree to the
                    <Link to="/terms" className="text-blue-500 underline">
                      terms and conditions
                    </Link>
                  </Label>
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
