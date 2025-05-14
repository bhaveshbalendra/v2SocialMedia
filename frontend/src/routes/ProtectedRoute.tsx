import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAuthUserRouteQuery } from "@/store/apis/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { PATH } from "./pathConstants";

const ProtectedRoute = () => {
  const { isAuthenticated, accessToken } = useAppSelector(
    (state) => state.auth
  );
  const { data, isLoading, error } = useAuthUserRouteQuery();
  const location = useLocation();
  const dispatch = useAppDispatch();

  //   useEffect(() => {
  //     // Check if we have both user data and accessToken
  //     if (data?.success && data?.user && data?.accessToken) {
  //       console.log(
  //         "Setting credentials from /me response in ProtectedRoute:",
  //         data
  //       );
  //       dispatch(
  //         setCredentials({
  //           user: data.user,
  //           accessToken: data.accessToken,
  //         })
  //       );

  //     }
  //   }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !isAuthenticated || !accessToken) {
    // Redirect to login page but save the attempted url
    return <Navigate to={PATH.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
