import { useSignupMutation } from "@/store/apis/auth.Api";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useSignup() {
  const [login, { isLoading, error }] = useSignupMutation();
  const navigate = useNavigate();
  const handleSignup = async (credentials) => {
    const response = await login(credentials).unwrap();
    if (response.error) {
      toast.error(error);
      return;
    }
    navigate("/login");
    toast.success("Signup successful");
    return;
  };

  return { handleSignup, isLoading, error };
}
