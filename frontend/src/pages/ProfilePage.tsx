import RouteSpinner from "@/components/common/RouteSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useMessageUser from "@/hooks/chat/useMessageUser";
import useProfile from "@/hooks/profiles/useProfile";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import {
  IUserPostForProfileData,
  IUserProfileData,
} from "@/types/profile.types";
const ProfilePage = () => {
  const {
    isLoadingProfile,
    errorProfile,
    userProfileData: user,
    handleFollow,
    handleUnfollow,
  } = useProfile();
  const { handleMessageUser } = useMessageUser();
  const userInfo = useAppSelector((state) => state.auth.user);
  const userId = userInfo?._id;

  if (isLoadingProfile) return <RouteSpinner />;
  if (errorProfile) return <div>Error: {errorProfile.toString()}</div>;

  if (user) {
    // Use a type assertion with unknown as an intermediary step
    const userData = user as IUserProfileData;
    const profilePicture = userData.profilePicture || "";
    const username = userData.username || "";
    const followers = userData.followers || [];
    const following = userData.following || [];
    const bio = userData.bio || "";
    const posts = userData.posts || [];
    const isFollowing = followers.find((follower) => follower._id === userId);

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
            <AvatarImage src={profilePicture} alt={username} />
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>

          <div className="flex-1 w-full space-y-4">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">{username}</h1>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {userId !== userData._id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    className="w-full sm:w-auto"
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}

                {userId !== userData._id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMessageUser(userData._id)}
                    className="w-full sm:w-auto"
                  >
                    Message
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex gap-6 sm:gap-8 text-sm sm:text-base">
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
            
            {bio && (
              <div className="text-sm sm:text-base text-muted-foreground">
                {bio}
              </div>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
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
