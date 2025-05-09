import { useLoginMutation } from "@/store/apis/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { ILoginRequest } from "@/types/auth.types";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppDispatch } from "./useAppDispatch";

export function useLogin() {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (credentials: ILoginRequest) => {
    const result = await login(credentials);
    if ("data" in result && result?.data?.success) {
      dispatch(
        setCredentials({
          user: result.data.user,
          accessToken: result.data.accessToken,
        })
      );
      toast.success(result.data.message || "Signup successful");
      navigate("/"); // Adjust to your protected route
    }
    // Errors are handled globally by errorMiddleware
  };

  return { handleLogin, isLoading };
}
