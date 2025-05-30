import {
  useAcceptFollowRequestMutation,
  useFollowUserMutation,
  useRejectFollowRequestMutation,
  useUnfollowUserMutation,
} from "@/store/apis/followApi";
import { useGetUserProfileQuery } from "@/store/apis/profileApi";

import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { setUserProfile } from "@/store/slices/profileSlice";
import { useEffect } from "react";
import { useParams } from "react-router";

const useProfile = () => {
  const param = useParams();
  const dispatch = useAppDispatch();

  // Only call the API when we have a valid username
  const shouldSkipQuery = !param.username || param.username.trim() === "";

  const {
    data,
    isLoading: isLoadingProfile,
    error: errorProfile,
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

  const handleFollow = async () => {
    try {
      if (param.username) {
        await followUser(param.username).unwrap();
        // Optionally refetch the profile data to get updated follow status
      }
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  const handleUnfollow = async () => {
    await unfollowUser(data?.user._id || "");
  };
  const handleAcceptFollowRequest = async (requestId: string) => {
    try {
      await acceptFollowRequest(requestId).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectFollowRequest = async (requestId: string) => {
    try {
      await rejectFollowRequest(requestId).unwrap();
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
