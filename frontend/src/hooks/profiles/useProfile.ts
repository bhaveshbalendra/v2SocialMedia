import {
  useAcceptFollowRequestMutation,
  useFollowUserMutation,
  useRejectFollowRequestMutation,
  useUnfollowUserMutation,
} from "@/store/apis/followApi";
import { useGetUserProfileQuery } from "@/store/apis/profileApi";

import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useDeleteNotificationMutation } from "@/store/apis/notificationApi";
import { removeNotification } from "@/store/slices/notificationSlice";
import {
  optimisticFollow,
  optimisticUnfollow,
  setUserProfile,
} from "@/store/slices/profileSlice";
import { useEffect } from "react";
import { useParams } from "react-router";

const useProfile = () => {
  const param = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Only call the API when we have a valid username
  const shouldSkipQuery = !param.username || param.username.trim() === "";

  const {
    data,
    isLoading: isLoadingProfile,
    error: errorProfile,
    refetch: refetchProfile,
  } = useGetUserProfileQuery(param.username || "", {
    skip: shouldSkipQuery, // Skip the query if no valid username
  });

  const [
    acceptFollowRequest,
    {
      isLoading: isAcceptFollowRequestLoading,
      error: acceptFollowRequestError,
    },
  ] = useAcceptFollowRequestMutation();
  const [
    rejectFollowRequest,
    {
      isLoading: isRejectFollowRequestLoading,
      error: rejectFollowRequestError,
    },
  ] = useRejectFollowRequestMutation();
  const [followUser, { isLoading: isFollowLoading, error: followError }] =
    useFollowUserMutation();
  const { userProfileData } = useAppSelector((state) => state.profile);
  const [unfollowUser, { isLoading: isUnfollowLoading, error: unfollowError }] =
    useUnfollowUserMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleFollow = async () => {
    try {
      if (param.username && user?._id) {
        // Optimistic update
        dispatch(
          optimisticFollow({
            currentUserId: user._id,
            currentUserInfo: {
              username: user.username || "",
              profilePicture: user.profilePicture || "",
            },
          })
        );
        await followUser(param.username).unwrap();
        // Refetch to get the latest data
        refetchProfile();
      }
    } catch (error) {
      // Revert optimistic update on error
      if (user?._id) {
        dispatch(optimisticUnfollow({ currentUserId: user._id }));
      }
      console.error("Failed to follow user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      if (param.username && user?._id) {
        // Optimistic update
        dispatch(optimisticUnfollow({ currentUserId: user._id }));
        await unfollowUser(param.username).unwrap();
        // Refetch to get the latest data
        refetchProfile();
      }
    } catch (error) {
      // Revert optimistic update on error
      if (user?._id) {
        dispatch(
          optimisticFollow({
            currentUserId: user._id,
            currentUserInfo: {
              username: user.username || "",
              profilePicture: user.profilePicture || "",
            },
          })
        );
      }
      console.error("Failed to unfollow user:", error);
    }
  };
  const handleAcceptFollowRequest = async ({
    requestId,
    notificationId,
  }: {
    requestId: string;
    notificationId: string;
  }) => {
    try {
      await acceptFollowRequest(requestId).unwrap();
      await deleteNotification(notificationId).unwrap();
      dispatch(removeNotification(notificationId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectFollowRequest = async ({
    requestId,
    notificationId,
  }: {
    requestId: string;
    notificationId: string;
  }) => {
    try {
      await rejectFollowRequest(requestId).unwrap();
      await deleteNotification(notificationId).unwrap();
      dispatch(removeNotification(notificationId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data) {
      dispatch(setUserProfile(data.user));
    }
  }, [data]);

  return {
    isLoadingProfile,
    errorProfile,
    userProfileData,
    handleFollow,
    isFollowLoading,
    handleUnfollow,
    followError,
    handleAcceptFollowRequest,
    isAcceptFollowRequestLoading,
    acceptFollowRequestError,
    handleRejectFollowRequest,
    isRejectFollowRequestLoading,
    rejectFollowRequestError,
    isUnfollowLoading,
    unfollowError,
  };
};

export default useProfile;
