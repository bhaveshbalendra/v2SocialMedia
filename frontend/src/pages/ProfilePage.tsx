import RouteSpinner from "@/components/common/RouteSpinner";
import { Icons } from "@/components/export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useProfile from "@/hooks/profiles/useProfile";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import {
  IUserPostForProfileData,
  IUserProfileData,
} from "@/types/profile.types";
import { Link } from "react-router";
const ProfilePage = () => {
  const {
    isLoadingProfile,
    errorProfile,
    userProfileData: user,
    handleFollow,
    handleUnfollow,
  } = useProfile();
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
                {/* {user.isOwnProfile && (
                  <Button size="sm" variant="outline">
                    Edit Profile
                  </Button>
                )} */}
                {userId !== userData._id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}

                <Button variant="outline" size="sm">
                  <Link to="/direct/inbox">Message</Link>
                </Button>
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
