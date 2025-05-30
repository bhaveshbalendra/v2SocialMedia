import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useSignupMutation } from "@/store/apis/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { ISignupApiRequest } from "@/types/auth.types";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useSignup() {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignup = async (credentials: ISignupApiRequest) => {
    const result = await signup(credentials);
    if ("data" in result && result?.data?.success) {
      dispatch(
        setCredentials({
          user: result.data.user,
          accessToken: result.data.accessToken,
        })
      );
      console.log(result);

      toast.success(result.data.message || "Login successful");
      navigate("/"); // Adjust to your protected route
    }
    // Errors are handled globally by errorMiddleware
  };

  return { handleSignup, isLoading };
}
