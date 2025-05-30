import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useLogoutMutation } from "@/store/apis/authApi";
import { logout as logoutSlice } from "@/store/slices/authSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useLogout() {
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const result = await logout();

    if (result?.data?.success) {
      dispatch(logoutSlice());
      toast.success(result.data.message || "Logout successful", {
        action: {
          label: "X",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      navigate("/login");
    }
    // Errors are handled globally by errorMiddleware
  };

  return { handleLogout, isLoading };
}
