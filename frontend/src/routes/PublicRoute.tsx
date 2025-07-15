import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { Navigate, Outlet } from "react-router";
import { PATH } from "./pathConstants";

/**
 * PublicRoute component that protects authentication pages (login/signup)
 * from being accessed by already authenticated users.
 *
 * If the user is authenticated, redirect them to the home page.
 * If not authenticated, allow access to the public route (login/signup).
 */
const PublicRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // If user is already authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to={PATH.HOME} replace />;
  }

  // User is not authenticated, allow access to public routes
  return <Outlet />;
};

export default PublicRoute;
