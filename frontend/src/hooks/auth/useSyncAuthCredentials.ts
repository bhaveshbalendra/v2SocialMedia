import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useAuthUserRouteQuery } from "@/store/apis/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { IAuthUserRouteApiResponse } from "@/types/auth.types";
import { useEffect, useRef } from "react";
/**
 * Syncs authentication credentials from the provided user data
 * into the Redux store whenever the data changes.
 *
 * @param data - The user data object from useAuthUserRouteQuery
 */
export function useSyncAuthCredentials(data?: IAuthUserRouteApiResponse) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data?.success && data?.user && data?.accessToken) {
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
        })
      );
    }
  }, [data, dispatch]);
}

/**
 * A hook that periodically refreshes the authentication token
 * by calling the /me endpoint to get a new access token.
 *
 * This helps prevent token expiration issues.
 */
export function useTokenRefresh() {
  const { refetch } = useAuthUserRouteQuery();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if we have an access token in localStorage
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      // Refresh now
      refetch();

      // Refresh every 15 minutes (900000ms)
      // This is shorter than our access token expiry to ensure we always have a valid token
      intervalRef.current = window.setInterval(() => {
        console.log("Refreshing auth token...");
        refetch();
      }, 15 * 60 * 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [refetch]);
}

/**
 * A hook that sets up polling to refresh the auth token every 6 hours.
 * This uses RTK Query's polling mechanism instead of a custom interval.
 *
 * Usage:
 * ```
 * function App() {
 *   // Add this to your main App component
 *   useTokenPolling();
 *   return <YourApp />;
 * }
 * ```
 */
export function useTokenPolling() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  // The polling interval is set to 6 hours
  const SIX_HOURS = 6 * 60 * 60 * 1000;

  // This sets up polling - RTK Query will automatically refetch
  // the data every 6 hours while the component is mounted
  useAuthUserRouteQuery(undefined, {
    pollingInterval: SIX_HOURS,
    skip: !isAuthenticated,
  });
}
