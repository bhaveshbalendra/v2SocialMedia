import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useLoginMutation } from "@/store/apis/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { ILoginApiRequest } from "@/types/auth.types";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useLogin() {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (credentials: ILoginApiRequest) => {
    const result = await login(credentials);
    if (result?.data?.success) {
      dispatch(
        setCredentials({
          user: result.data.user,
          accessToken: result.data.accessToken,
        })
      );
      toast.success(result.data.message || "Signup successful", {
        action: {
          label: "X",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      navigate("/"); // Adjust to your protected route
    }
    // Errors are handled globally by errorMiddleware
  };

  return { handleLogin, isLoading };
}
