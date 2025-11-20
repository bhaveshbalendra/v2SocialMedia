import useDeleteAllNotifications from "@/hooks/notifications/useDeleteAllNotifications";
import useMarkReadNotification from "@/hooks/notifications/useMarkReadNotifiaction";
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
  const { markAllNotificationsAsRead } = useMarkReadNotification();
  const { handleDeleteAllNotifications, isLoading: isDeletingAll } =
    useDeleteAllNotifications();
  const {
    handleAcceptFollowRequest,
    handleRejectFollowRequest,
    isAcceptFollowRequestLoading,
    isRejectFollowRequestLoading,
  } = useProfile();
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(
    new Set()
  );

  const handleAcceptRequest = async ({
    requestId,
    notificationId,
  }: {
    requestId: string;
    notificationId: string;
  }) => {
    try {
      setProcessingRequests((prev) => new Set(prev).add(requestId));
      await handleAcceptFollowRequest({ requestId, notificationId });
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

  const handleRejectRequest = async ({
    requestId,
    notificationId,
  }: {
    requestId: string;
    notificationId: string;
  }) => {
    try {
      setProcessingRequests((prev) => new Set(prev).add(requestId));
      await handleRejectFollowRequest({ requestId, notificationId });
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
        return <User className="h-4 w-4 text-foreground" />;
      case "POST_LIKED":
      case "COMMENT_LIKED":
        return <Heart className="h-4 w-4 text-foreground" />;
      case "POST_COMMENTED":
      case "COMMENT_REPLIED":
        return <MessageCircle className="h-4 w-4 text-foreground" />;
      case "POST_SHARED":
        return <Share className="h-4 w-4 text-foreground" />;
      default:
        return <User className="h-4 w-4 text-foreground" />;
    }
  };

  const renderNotificationContent = (notification: NotificationData) => {
    const senderData =
      typeof notification.sender === "object"
        ? notification.sender
        : { username: "User", profilePicture: undefined };
    const entityData = notification.entityData;

    return (
      <div className="flex items-start gap-3 p-3 border border-foreground rounded-md hover:bg-background transition-colors">
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
            <p className="text-sm font-medium text-foreground">
              {notification.content}
            </p>
          </div>

          {/* Entity Data Display */}
          {entityData && (
            <div className="mt-2 p-2 bg-background rounded-md">
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
                    <span className="text-xs text-foreground">
                      @{entityData.from?.username}
                    </span>
                  </div>
                  {notification.type === "FOLLOW_REQUEST" &&
                    entityData?._id && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs text-foreground border-foreground hover:bg-foreground hover:text-background"
                          onClick={() =>
                            handleAcceptRequest({
                              requestId: entityData._id!,
                              notificationId: notification._id!,
                            })
                          }
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
                          className="h-6 px-2 text-xs text-foreground border-foreground hover:bg-foreground hover:text-background"
                          onClick={() =>
                            handleRejectRequest({
                              requestId: entityData._id!,
                              notificationId: notification._id!,
                            })
                          }
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
                  <span className="text-xs text-foreground truncate">
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
                  <span className="text-xs text-foreground">
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
          <div className="h-2 w-2 bg-foreground rounded-full mt-2"></div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClick}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            Notifications
          </DialogTitle>
          {/* Action Buttons */}
          {notifications && notifications.length > 0 && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-foreground border-foreground hover:bg-foreground hover:text-background"
                onClick={() => markAllNotificationsAsRead()}
              >
                Mark all as read
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => handleDeleteAllNotifications()}
                disabled={isDeletingAll}
              >
                {isDeletingAll ? "Deleting..." : "Delete all notifications"}
              </Button>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
              <p className="mt-2 text-sm text-foreground">
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
              <User className="h-12 w-12 text-foreground mx-auto mb-2" />
              <p className="text-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground">
                You'll see notifications here when someone interacts with you
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
