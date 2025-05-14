import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setCredentials } from "@/store/slices/authSlice";
import { IAuthUserRouteResponse } from "@/types/auth.types";
import { useEffect } from "react";

/**
 * Syncs authentication credentials from the provided user data
 * into the Redux store whenever the data changes.
 *
 * @param data - The user data object from useAuthUserRouteQuery
 */
export function useSyncAuthCredentials(data?: IAuthUserRouteResponse) {
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

//   const { data, isLoading, error, refetch } = useAuthUserRouteQuery();

//   // Use the custom hook to sync credentials
//   useSyncAuthCredentials(data);

//   if (isLoading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <AiOutlineLoading3Quarters className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
//         <p className="text-destructive">Error loading user data</p>
//         <Retry onClick={() => refetch()} />
//       </div>
//     );
//   }
