import { useAppSelector } from "@/hooks/redux/useAppSelector";
import {
  useFollowUserMutation,
  useGetSuggestedUsersQuery,
} from "@/store/apis/followApi";
import { useCallback } from "react";
import { toast } from "sonner";

export const useSuggestedUsers = (limit: number = 5) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    data: suggestedUsersData,
    isLoading,
    error,
    refetch,
  } = useGetSuggestedUsersQuery(
    { limit },
    {
      skip: !isAuthenticated,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();

  const handleFollow = useCallback(
    async (username: string) => {
      if (!isAuthenticated) {
        toast.error("Please log in to follow users");
        return;
      }

      try {
        await followUser(username).unwrap();
        toast.success(`Started following @${username}!`);

        // Refresh suggestions after following to get new recommendations
        setTimeout(() => {
          refetch();
        }, 1000);
      } catch (error: unknown) {
        console.error("Failed to follow user:", error);

        // Handle specific error messages
        const errorMessage =
          error && typeof error === "object" && "data" in error
            ? (error as { data?: { message?: string } }).data?.message
            : error && typeof error === "object" && "message" in error
            ? (error as { message?: string }).message
            : "Failed to follow user";

        toast.error(errorMessage || "Failed to follow user");
      }
    },
    [followUser, isAuthenticated, refetch]
  );

  const refreshSuggestions = useCallback(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [refetch, isAuthenticated]);

  return {
    suggestions: suggestedUsersData?.data || [],
    isLoading,
    error,
    isFollowing,
    handleFollow,
    refreshSuggestions,
    hasData: suggestedUsersData?.data && suggestedUsersData.data.length > 0,
  };
};
