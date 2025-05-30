import useNotification from "@/hooks/notifications/useNotification";
import useProfile from "@/hooks/profiles/useProfile";
import { formatDistanceToNow } from "date-fns";
import { Check, Heart, MessageCircle, Share, User, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface NotificationData {
  _id: string;
  type: string;
  content: string;
  createdAt: string;
  read: boolean;
  entityModel?: string;
  sender?:
    | {
        username: string;
        profilePicture?: string;
      }
    | string;
  entityData?: {
    _id?: string;
    from?: {
      username: string;
      profilePicture?: string;
    };
    to?: {
      username: string;
      profilePicture?: string;
    };
    media?: Array<{ url: string }>;
    title?: string;
    username?: string;
    profilePicture?: string;
  };
}

const NotificationModal = ({
  onClick,
  open,
}: {
  onClick: () => void;
  open: boolean;
}) => {
  const { notifications, isLoading } = useNotification();
  const {
    handleAcceptFollowRequest,
    handleRejectFollowRequest,
    isAcceptFollowRequestLoading,
    isRejectFollowRequestLoading,
  } = useProfile();
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(
    new Set()
  );

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setProcessingRequests((prev) => new Set(prev).add(requestId));
      await handleAcceptFollowRequest(requestId);
    } catch (error) {
      console.error("Error accepting follow request:", error);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setProcessingRequests((prev) => new Set(prev).add(requestId));
      await handleRejectFollowRequest(requestId);
    } catch (error) {
      console.error("Error rejecting follow request:", error);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "FOLLOW_REQUEST":
      case "FOLLOWED":
      case "FOLLOW_ACCEPTED":
        return <User className="h-4 w-4 text-blue-500" />;
      case "POST_LIKED":
      case "COMMENT_LIKED":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "POST_COMMENTED":
      case "COMMENT_REPLIED":
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case "POST_SHARED":
        return <Share className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderNotificationContent = (notification: NotificationData) => {
    const senderData =
      typeof notification.sender === "object"
        ? notification.sender
        : { username: "User", profilePicture: undefined };
    const entityData = notification.entityData;

    return (
      <div className="flex items-start gap-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
        {/* Sender Avatar */}
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={senderData?.profilePicture}
            alt={senderData?.username || "User"}
          />
          <AvatarFallback>
            {senderData?.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Notification Content */}
          <div className="flex items-center gap-2 mb-1">
            {getNotificationIcon(notification.type)}
            <p className="text-sm font-medium text-gray-900">
              {notification.content}
            </p>
          </div>

          {/* Entity Data Display */}
          {entityData && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md">
              {notification.entityModel === "FollowRequest" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={entityData.from?.profilePicture}
                        alt={entityData.from?.username}
                      />
                      <AvatarFallback>
                        {entityData.from?.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">
                      @{entityData.from?.username}
                    </span>
                  </div>
                  {notification.type === "FOLLOW_REQUEST" &&
                    entityData?._id && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleAcceptRequest(entityData._id!)}
                          disabled={
                            processingRequests.has(entityData._id) ||
                            isAcceptFollowRequestLoading
                          }
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleRejectRequest(entityData._id!)}
                          disabled={
                            processingRequests.has(entityData._id) ||
                            isRejectFollowRequestLoading
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                </div>
              )}

              {notification.entityModel === "Post" && entityData && (
                <div className="flex items-center gap-2">
                  {entityData.media?.[0]?.url && (
                    <img
                      src={entityData.media[0].url}
                      alt="Post"
                      className="h-8 w-8 rounded object-cover"
                    />
                  )}
                  <span className="text-xs text-gray-600 truncate">
                    {entityData.title || "Post"}
                  </span>
                </div>
              )}

              {notification.entityModel === "User" && entityData && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={entityData.profilePicture}
                      alt={entityData.username}
                    />
                    <AvatarFallback>
                      {entityData.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-600">
                    @{entityData.username}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <span className="text-xs text-muted-foreground mt-1 block">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {/* Read Status Indicator */}
        {!notification.read && (
          <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClick}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">
                Loading notifications...
              </p>
            </div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification._id}>
                {renderNotificationContent(notification)}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No notifications yet</p>
              <p className="text-sm text-gray-400">
                You'll see notifications here when someone interacts with you
              </p>
            </div>
          )}
        </div>

        {/* Mark All as Read Button */}
        {notifications && notifications.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                // TODO: Implement mark all as read functionality
                console.log("Mark all as read");
              }}
            >
              Mark all as read
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
