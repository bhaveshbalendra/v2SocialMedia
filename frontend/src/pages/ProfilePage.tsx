import RouteSpinner from "@/components/common/RouteSpinner";
import { Icons } from "@/components/export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useMessageUser from "@/hooks/chat/useMessageUser";
import useProfile from "@/hooks/profiles/useProfile";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/store/apis/followApi";
import { useCheckFollowStatusQuery } from "@/store/apis/profileApi";
import {
  IUserPostForProfileData,
  IUserProfileData,
} from "@/types/profile.types";
import { toast } from "sonner";

const ProfilePage = () => {
  const {
    isLoadingProfile,
    errorProfile,
    userProfileData: user,
  } = useProfile();
  const userInfo = useAppSelector((state) => state.auth.user);
  const userId = userInfo?._id;
  const { handleMessageUser, isLoading: isMessageLoading } = useMessageUser();

  // Get follow status for the current user viewing this profile
  const userData = user as IUserProfileData | null;
  const { data: followStatusData, isLoading: followStatusLoading } =
    useCheckFollowStatusQuery(userData?._id || "", {
      skip: !userData?._id || !userId || userData?._id === userId,
    });

  const [followUser, { isLoading: isFollowLoading }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowLoading }] =
    useUnfollowUserMutation();

  const handleFollow = async () => {
    if (!userData || !userData.username) return;

    try {
      const result = await followUser(userData.username).unwrap();
      toast.success(result.message);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to follow user";
      toast.error(errorMessage);
    }
  };

  const handleUnfollow = async () => {
    if (!userData || !userData.username) return;

    try {
      const result = await unfollowUser(userData.username).unwrap();
      toast.success(result.message);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to unfollow user";
      toast.error(errorMessage);
    }
  };

  const getFollowButtonContent = () => {
    if (followStatusLoading || isFollowLoading || isUnfollowLoading) {
      return <Icons.Spinner className="animate-spin h-4 w-4" />;
    }

    const status = followStatusData?.data?.status;

    switch (status) {
      case "following":
        return "Unfollow";
      case "requested":
        return "Follow Request Sent";
      case "private":
        return "Follow";
      case "not_following":
      default:
        return "Follow";
    }
  };

  const getFollowButtonAction = () => {
    const status = followStatusData?.data?.status;

    if (status === "following") {
      return handleUnfollow;
    } else if (status === "requested") {
      return () => {}; // No action for pending requests
    } else {
      return handleFollow;
    }
  };

  if (isLoadingProfile) return <RouteSpinner />;
  if (errorProfile) return <div>Error: {errorProfile.toString()}</div>;

  if (user) {
    // Type guard to ensure we have a proper user object
    const userData = user as IUserProfileData;
    const profilePicture = userData.profilePicture || "";
    const username = userData.username || "";
    const followers = userData.followers || [];
    const following = userData.following || [];
    const bio = userData.bio || "";
    const posts = userData.posts || [];

    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <Avatar className="w-28 h-28">
            <AvatarImage src={profilePicture} alt={username} />
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>

          <div className="flex-1 w-full">
            <div>
              <div>
                <span className="text-xl font-semibold">{username}</span>
                <Button variant="outline" size="sm">
                  <Icons.ThreeDots />
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
                {userId !== userData._id && (
                  <Button
                    size="sm"
                    variant={
                      followStatusData?.data?.status === "following"
                        ? "secondary"
                        : "outline"
                    }
                    onClick={getFollowButtonAction()}
                    disabled={
                      followStatusLoading ||
                      isFollowLoading ||
                      isUnfollowLoading ||
                      followStatusData?.data?.status === "requested"
                    }
                  >
                    {getFollowButtonContent()}
                  </Button>
                )}

                {userId !== userData._id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMessageUser(userData._id)}
                    disabled={isMessageLoading}
                  >
                    {isMessageLoading ? (
                      <Icons.Spinner className="animate-spin" />
                    ) : (
                      "Message"
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex gap-6 text-sm mb-2">
              <span>
                <span className="font-bold">{posts.length || 0}</span> posts
              </span>
              <span>
                <span className="font-bold">{followers.length || 0}</span>{" "}
                followers
              </span>
              <span>
                <span className="font-bold">{following.length || 0}</span>{" "}
                following
              </span>
            </div>
            <div className="text-muted-foreground">{bio}</div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-2">
          {posts.map((post: IUserPostForProfileData) => (
            <Card
              key={post._id}
              className="aspect-square overflow-hidden group"
            >
              <CardContent className="p-0 h-full w-full">
                <img
                  src={post.media?.[0]?.url || ""}
                  alt="Post"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default ProfilePage;
