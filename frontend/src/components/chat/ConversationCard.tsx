import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import {
  setActiveChat,
  setSelectedConversation,
} from "@/store/slices/chatSlice";
import { IConversation } from "@/types/chat.types";
import { formatDistanceToNow } from "date-fns";
import { Icons } from "../export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface ConversationCardProps {
  conversation: IConversation;
  onSelect?: () => void;
}

const ConversationCard = ({
  conversation,
  onSelect,
}: ConversationCardProps) => {
  const dispatch = useAppDispatch();
  const { selectedConversation, unreadCounts } = useAppSelector(
    (state) => state.chat
  );
  const userInfo = useAppSelector((state) => state.auth.user);

  const handleSelectedFriend = (conversation: IConversation) => {
    dispatch(setSelectedConversation(conversation));

    // Set active chat and clear unread count
    const otherParticipant = conversation.participants.find(
      (participant) => participant._id !== userInfo?._id
    );
    if (otherParticipant) {
      dispatch(setActiveChat(otherParticipant._id));
    }

    // Call onSelect for mobile responsiveness
    onSelect?.();
  };

  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants.find(
    (participant) => participant._id !== userInfo?._id
  );

  // Get unread count for this conversation
  const unreadCount = otherParticipant
    ? unreadCounts[otherParticipant._id] || 0
    : 0;

  // Check if this conversation is currently selected
  const isSelected = selectedConversation?._id === conversation._id;

  return (
    <Button
      key={conversation._id}
      onClick={() => handleSelectedFriend(conversation)}
      variant="ghost"
      className={`
        flex items-center gap-3 p-4 h-auto justify-start w-full
        hover:bg-accent transition-colors relative
        ${isSelected ? "bg-accent border-r-2 border-r-primary" : ""}
      `}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={otherParticipant?.profilePicture}
            alt={otherParticipant?.username}
          />
          <AvatarFallback className="bg-muted">
            {otherParticipant?.username?.[0]?.toUpperCase() || (
              <Icons.Profile className="h-6 w-6" />
            )}
          </AvatarFallback>
        </Avatar>

        {/* Online indicator - you can implement this later */}
        {/* <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div> */}
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`font-medium truncate text-sm ${
              isSelected ? "text-primary" : "text-foreground"
            } ${unreadCount > 0 ? "font-semibold" : ""}`}
          >
            {otherParticipant?.username || "Unknown User"}
          </h3>

          <div className="flex items-center gap-2">
            {/* Time indicator */}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(conversation.lastActivity), {
                addSuffix: false,
              })}
            </span>

            {/* Unread count badge */}
            {unreadCount > 0 && (
              <Badge
                variant="default"
                className="text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] rounded-full"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Last message preview - you can add this later */}
          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            {conversation.lastMessage || "Say hello! 👋"}
          </p>

          {/* Message status indicator */}
          {unreadCount === 0 && isSelected && (
            <div className="w-2 h-2 bg-primary rounded-full ml-2 flex-shrink-0"></div>
          )}
        </div>
      </div>
    </Button>
  );
};

export default ConversationCard;
