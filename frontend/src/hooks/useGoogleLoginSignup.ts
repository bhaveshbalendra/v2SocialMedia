import { useGoogleMutation } from "@/store/apis/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { IGoogleAuthRequest } from "@/types/auth.types";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppDispatch } from "./useAppDispatch";

export function useGoogleLoginSignup() {
  const [google, { isLoading }] = useGoogleMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoogleAuth = async (credentials: IGoogleAuthRequest) => {
    const result = await google(credentials);
    if (result?.data?.success) {
      dispatch(
        setCredentials({
          user: result.data.user,
          accessToken: result.data.accessToken,
        })
      );
      toast.success(result.data.message || "Google Login successful");
      navigate("/"); // Adjust to your protected route
    }
    // Errors are handled globally by errorMiddleware
  };

  return { handleGoogleAuth, isLoading };
}
