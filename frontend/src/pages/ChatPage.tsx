import ConversationCard from "@/components/chat/ConversationCard";
import Messages from "@/components/chat/Messages";
import { Icons } from "@/components/export/Icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useGetConversations from "@/hooks/chat/useGetConversations";
import useGetMessages from "@/hooks/chat/useGetMessages";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { setSelectedConversation } from "@/store/slices/chatSlice";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

const ChatPage = () => {
  const { isLoading, isError } = useGetConversations();
  const { selectedConversation, conversations } = useAppSelector(
    (state) => state.chat
  );
  const dispatch = useAppDispatch();
  const [isMobileConversationListOpen, setIsMobileConversationListOpen] =
    useState(true);

  // Initialize message fetching (socket is already initialized in App.tsx)
  useGetMessages();

  const handleBackToConversations = () => {
    setIsMobileConversationListOpen(true);
    // Clear selected conversation
    dispatch(setSelectedConversation(null));
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="p-6 max-w-md mx-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Unable to load chats</h2>
            <p className="text-sm text-muted-foreground">
              There was a problem loading your conversations. Please try again.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background -mx-4 -mt-4 -mb-16 lg:mb-4 lg:mx-0 lg:mt-0">
      {/* Desktop: Side-by-side layout */}
      {/* Mobile/Tablet: Show conversations list or chat based on selection */}

      {/* Conversations List */}
      <div
        className={`
        w-full md:w-96 lg:w-1/3 xl:w-96 border-r bg-card
        ${
          selectedConversation && !isMobileConversationListOpen
            ? "hidden md:flex"
            : "flex"
        }
        flex-col h-full
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
          <Button variant="ghost" size="icon" title="New Message">
            <Icons.SquarePlus className="h-5 w-5" />
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations && conversations.length > 0 ? (
            <div className="divide-y">
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation._id}
                  conversation={conversation}
                  onSelect={() => setIsMobileConversationListOpen(false)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="rounded-full bg-muted p-6 mb-4">
                <MessageCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No conversations yet
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Send a message to start a conversation with someone
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`
        flex-1 bg-background
        ${
          !selectedConversation || isMobileConversationListOpen
            ? "hidden md:flex"
            : "flex"
        }
        flex-col h-full
      `}
      >
        {selectedConversation ? (
          <Messages onBackClick={handleBackToConversations} />
        ) : (
          // Desktop: Show empty state when no conversation selected
          <div className="hidden md:flex h-full w-full items-center justify-center">
            <Card className="p-8 max-w-md mx-4">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <MessageCircle className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Your Messages</h2>
                <p className="text-muted-foreground">
                  Send a message to start a conversation with your friends and
                  followers
                </p>
                <Button variant="outline">Send Message</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
