import useGetMessages from "@/hooks/chat/useGetMessages";
import useSendMessage from "@/hooks/chat/useSendMessage";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Icons } from "../export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

interface MessagesProps {
  onBackClick?: () => void;
}

const Messages = ({ onBackClick }: MessagesProps) => {
  const { selectedConversation } = useAppSelector((state) => state.chat);
  const userInfo = useAppSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");

  // Use the hooks for real-time messaging (socket is initialized in App.tsx)
  const { messages, isLoading: isLoadingMessages } = useGetMessages();
  const { sendMessage, isLoading: isSending } = useSendMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim()) {
      await sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const formEvent = {
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>;
      handleSubmit(formEvent);
    }
  };

  // Get the other participant for display
  const otherParticipant = selectedConversation?.participants.find(
    (participant) => participant._id !== userInfo?._id
  );

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-0 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-2 sm:p-4 border-b bg-card flex-shrink-0 min-w-0">
        {/* Back button for mobile */}
        {onBackClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackClick}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        <Avatar className="h-10 w-10">
          <AvatarImage
            src={otherParticipant?.profilePicture}
            alt={otherParticipant?.username}
          />
          <AvatarFallback className="bg-muted">
            {otherParticipant?.username?.[0]?.toUpperCase() || (
              <Icons.Profile className="h-5 w-5" />
            )}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 overflow-hidden">
          <h1 className="font-semibold text-sm sm:text-base text-foreground truncate">
            {otherParticipant?.username || "Unknown User"}
          </h1>
        </div>
      </div>

      {/* Messages Display */}
      <ScrollArea className="flex-1 min-h-0 px-2 sm:px-4">
        <div className="py-4 space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => {
              const isOwnMessage = msg.senderId === userInfo?._id;
              const isTemporary = msg.id?.startsWith("temp-");
              const showAvatar =
                !isOwnMessage &&
                (index === 0 ||
                  messages[index - 1]?.senderId !== msg.senderId ||
                  new Date(msg.createdAt || "").getTime() -
                    new Date(messages[index - 1]?.createdAt || "").getTime() >
                    300000); // 5 minutes

              return (
                <div
                  key={msg.id || index}
                  className={`flex items-end gap-2 ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar for received messages */}
                  {!isOwnMessage && (
                    <Avatar
                      className={`h-7 w-7 ${showAvatar ? "" : "invisible"}`}
                    >
                      <AvatarImage
                        src={otherParticipant?.profilePicture}
                        alt={otherParticipant?.username}
                      />
                      <AvatarFallback className="bg-muted text-xs">
                        {otherParticipant?.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`group relative max-w-[min(70%,calc(100vw-8rem))] sm:max-w-[60%] ${
                      isOwnMessage ? "ml-auto" : ""
                    }`}
                  >
                    <Card
                      className={`p-3 ${
                        isOwnMessage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      } ${isTemporary ? "opacity-70" : ""}`}
                    >
                      <p className="text-sm break-words leading-relaxed">
                        {msg.content}
                      </p>
                    </Card>

                    {/* Timestamp */}
                    <div
                      className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(msg.createdAt || ""), {
                          addSuffix: true,
                        })}
                      </p>
                      {isTemporary && (
                        <span className="text-xs text-muted-foreground opacity-60">
                          • Sending...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Icons.Message className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start the conversation with {otherParticipant?.username}!
              </p>
            </div>
          )}
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-2 sm:p-4 border-t bg-card flex-shrink-0 min-w-0">
        <div className="flex gap-2 items-end min-w-0">
          <div className="flex-1 min-w-0">
            <Input
              onChange={handleSendMessage}
              onKeyPress={handleKeyPress}
              value={message}
              type="text"
              placeholder={`Message ${otherParticipant?.username || "user"}...`}
              className="resize-none border-0 bg-muted focus-visible:ring-1 focus-visible:ring-ring text-sm sm:text-base min-w-0"
              disabled={isSending}
              autoComplete="off"
              autoCapitalize="sentences"
            />
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || isSending}
            size="icon"
            className="shrink-0 h-8 w-8 sm:h-10 sm:w-10"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Messages;
