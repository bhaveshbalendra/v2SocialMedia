import { Icons } from "@/components/export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { PATH, generateRoute } from "@/routes/pathConstants";
import {
  useFollowUserMutation,
  useGetSuggestedUsersQuery,
} from "@/store/apis/followApi";
import React from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const SuggestedUsers: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    data: suggestedUsersData,
    isLoading,
    error,
    refetch,
  } = useGetSuggestedUsersQuery({ limit: 5 }, { skip: !isAuthenticated });

  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();

  const handleFollow = async (username: string) => {
    try {
      await followUser(username).unwrap();
      toast.success(`Started following @${username}!`);
      refetch(); // Refresh suggestions after following
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast.error("Failed to follow user");
    }
  };

  // Don't show suggestions if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Suggested for you
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (
    error ||
    !suggestedUsersData?.data ||
    suggestedUsersData.data.length === 0
  ) {
    // Only log error in development, don't show error to user
    if (error && process.env.NODE_ENV === "development") {
      console.warn("Suggested users error:", error);
    }
    return null; // Don't show the card if there's an error or no suggestions
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Suggested for you
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedUsersData.data
          .filter(
            (user) => user && user.username && user.firstName && user.lastName
          ) // Filter out invalid users
          .map((user) => (
            <div key={user._id} className="flex items-center justify-between">
              <Link
                to={generateRoute(PATH.PROFILE, { username: user.username })}
                className="flex items-center space-x-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback>
                    {user.firstName[0]?.toUpperCase() ||
                      user.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-medium text-sm truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    {user.isVerified && (
                      <span className="text-blue-500 text-xs">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    @{user.username}
                  </p>
                  {user.bio && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {user.bio}
                    </p>
                  )}
                </div>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleFollow(user.username)}
                disabled={isFollowing}
                className="ml-2 flex-shrink-0"
              >
                {isFollowing ? (
                  <Icons.Spinner className="h-3 w-3 animate-spin" />
                ) : (
                  "Follow"
                )}
              </Button>
            </div>
          ))}

        <div className="pt-2">
          <Link
            to="/suggestions" // You can create a full suggestions page later
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See all suggestions
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedUsers;
