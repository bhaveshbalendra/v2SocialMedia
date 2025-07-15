import RouteSpinner from "@/components/common/RouteSpinner";
import { useSyncAuthCredentials } from "@/hooks/auth/useSyncAuthCredentials";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useAuthUserRouteQuery } from "@/store/apis/authApi";
import { Navigate, Outlet, useLocation } from "react-router";
import { PATH } from "./pathConstants";
const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Call the ME endpoint to validate the token and get a refreshed token if needed
  const { data, isLoading } = useAuthUserRouteQuery();

  // Use the custom hook to sync credentials when data changes
  useSyncAuthCredentials(data);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RouteSpinner />
      </div>
    );
  }

  // If there's an error or user is not authenticated, redirect to login
  if (!isAuthenticated) {
    // Redirect to login page but save the attempted url
    return <Navigate to={PATH.LOGIN} state={{ from: location }} replace />;
  }

  // The user is authenticated - render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
