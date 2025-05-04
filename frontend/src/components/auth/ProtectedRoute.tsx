import { useAppSelector } from "@/hooks/useAppSelector";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  if (!isAuthenticated && token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
