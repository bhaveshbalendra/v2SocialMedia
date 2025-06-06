import { Icons } from "@/components/export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/config/configs";
import { useBookmarks } from "@/hooks/bookmarks/useBookmarks";
import { useBookmarkStatus } from "@/hooks/bookmarks/useBookmarkStatus";
import { useComments } from "@/hooks/comments/useComments";
import { useLike } from "@/hooks/likes/useLike";
import { useDeletePost } from "@/hooks/posts/useDeletePost";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useSocket } from "@/hooks/sockets/useSocket";
import { IComment } from "@/store/apis/commentApi";
import { setSelectedPost } from "@/store/slices/postSlice";
import {
  SocketCommentDeleteEvent,
  SocketCommentEvent,
} from "@/types/socket.types";
import { formatDistanceToNow } from "date-fns";
import {
  Edit,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";

const SelectPostModel = () => {
  const dispatch = useAppDispatch();
  const { selectedPost } = useAppSelector((state) => state.post);
  const { user } = useAppSelector((state) => state.auth);
  const { handleLikePost, handleUnlikePost } = useLike();
  const { handleDeletePost, isDeleting } = useDeletePost();
  const { handleToggleBookmark, isToggling } = useBookmarks();
  const { isBookmarked, toggleBookmarkStatus } = useBookmarkStatus(false);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState<IComment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const prevPostIdRef = React.useRef<string | null>(null);

  // Socket integration for real-time comments
  const socket = useSocket();
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const isOwnPost = user?._id === selectedPost?.author?._id;

  // Comments functionality - Load initial comments
  const {
    comments: initialComments,
    isLoadingComments,
    handleCreateComment,
    isCreatingComment,
    handleToggleLike,
    handleDeleteComment,
    pagination,
  } = useComments({
    postId: selectedPost?._id || "",
    page: 1,
    limit: 20,
  });

  // Reset state when post changes
  React.useEffect(() => {
    const currentPostId = selectedPost?._id;

    if (currentPostId !== prevPostIdRef.current) {
      // Post has changed or cleared, reset everything
      setAllComments([]);
      setCurrentPage(1);
      setIsLoadingMore(false);
      prevPostIdRef.current = currentPostId || null;
    }
  }, [selectedPost?._id]);

  // Update allComments when we have initial comments for the current post
  React.useEffect(() => {
    if (
      selectedPost?._id === prevPostIdRef.current &&
      initialComments?.length > 0
    ) {
      setAllComments(initialComments);
    }
  }, [initialComments]);

  // Socket listeners for real-time comment updates
  React.useEffect(() => {
    if (!socket || !selectedPost?._id) return;

    // Track socket connection status
    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    setIsSocketConnected(socket.connected);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    const handleNewComment = (data: SocketCommentEvent) => {
      console.log("Received new comment via socket:", data);
      // Only add comment if it's for the currently viewed post
      if (data.postId === selectedPost._id) {
        setAllComments((prevComments) => {
          // Check if comment already exists (avoid duplicates)
          const commentExists = prevComments.some(
            (c) => c._id === data.comment._id
          );
          if (!commentExists) {
            console.log("Adding new comment to UI:", data.comment);
            // Also remove any optimistic comments from the same user with similar content
            const filteredComments = prevComments.filter(
              (c) =>
                !(
                  c._id.startsWith("temp-") &&
                  c.user._id === data.comment.user._id &&
                  c.content === data.comment.content
                )
            );
            return [data.comment, ...filteredComments];
          }
          console.log("Comment already exists, skipping:", data.comment._id);
          return prevComments;
        });
      }
    };

    const handleCommentDeleted = (data: SocketCommentDeleteEvent) => {
      console.log("Received comment deletion via socket:", data);
      // Only remove comment if it's for the currently viewed post
      if (data.postId === selectedPost._id) {
        setAllComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== data.commentId)
        );
      }
    };

    socket.on("newComment", handleNewComment);
    socket.on("commentDeleted", handleCommentDeleted);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newComment", handleNewComment);
      socket.off("commentDeleted", handleCommentDeleted);
    };
  }, [socket, selectedPost?._id]);

  // Load more comments function
  const loadMoreComments = async () => {
    if (!pagination?.hasMore || isLoadingMore || !selectedPost?._id) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(
        `${apiUrl}/comments/${selectedPost._id}?page=${nextPage}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.comments) {
        setAllComments((prev) => [...prev, ...data.comments]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const isOpen = !!selectedPost;

  const handleClose = () => {
    dispatch(setSelectedPost(null));
  };

  const handleSubmitComment = async () => {
    if (comment.trim() && selectedPost?._id && user && !isPostingComment) {
      setIsPostingComment(true);

      // Create optimistic comment
      const optimisticComment: IComment = {
        _id: `temp-${Date.now()}`,
        user: {
          _id: user._id,
          username: user.username,
          profilePicture: user.profilePicture,
        },
        post: selectedPost._id,
        content: comment.trim(),
        likes: [],
        likesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically add comment to UI
      setAllComments((prevComments) => [optimisticComment, ...prevComments]);
      setComment("");

      // Set a timeout to remove optimistic comment if request takes too long (10 seconds)
      const timeoutId = setTimeout(() => {
        setAllComments((prevComments) =>
          prevComments.filter((c) => c._id !== optimisticComment._id)
        );
        setIsPostingComment(false);
        console.log("Removed optimistic comment due to timeout");
      }, 10000);

      try {
        const success = await handleCreateComment(comment.trim());
        clearTimeout(timeoutId); // Clear timeout since request completed
        setIsPostingComment(false);

        if (success) {
          console.log(
            "Comment created successfully, waiting for socket update"
          );
          // Remove optimistic comment since real one will come via socket
          setAllComments((prevComments) =>
            prevComments.filter((c) => c._id !== optimisticComment._id)
          );
        } else {
          // Remove optimistic comment on failure
          setAllComments((prevComments) =>
            prevComments.filter((c) => c._id !== optimisticComment._id)
          );
          console.error("Failed to create comment: API returned false");
        }
      } catch (error) {
        clearTimeout(timeoutId); // Clear timeout since request completed
        setIsPostingComment(false);
        // Remove optimistic comment on error
        setAllComments((prevComments) =>
          prevComments.filter((c) => c._id !== optimisticComment._id)
        );
        console.error("Failed to create comment:", error);
      }
    }
  };

  if (!selectedPost) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-full h-[95vh] lg:h-[90vh] p-0 max-w-[95vw] lg:max-w-6xl [&>button]:hidden">
        {/* Accessibility labels - visually hidden but available to screen readers */}
        <DialogTitle className="sr-only">
          Post by {selectedPost.author?.username}
        </DialogTitle>
        <DialogDescription className="sr-only">
          View and interact with this post including image, comments, and
          actions
        </DialogDescription>

        <div className="flex h-full flex-col lg:flex-row">
          {/* Left side - Image (hidden on mobile/tablet, visible on desktop) */}
          <div className="hidden lg:flex flex-1 bg-black items-center justify-center min-w-0">
            {selectedPost.media &&
            selectedPost.media.length > 0 &&
            selectedPost.media[0].type === "image" ? (
              <img
                src={selectedPost.media[0].url}
                alt={selectedPost.title || "Post media"}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-white text-center">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center text-4xl">
                  📷
                </div>
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* Right side - Post details (full width on mobile/tablet, fixed width on desktop) */}
          <div className="w-full lg:w-96 flex flex-col h-full max-h-full overflow-hidden">
            {/* Header - Fixed */}
            <div className="p-3 sm:p-4 border-b flex items-center gap-3 flex-shrink-0">
              <Link to={`/${selectedPost.author?.username}`}>
                <Avatar className="w-8 h-8">
                  {selectedPost.author?.profilePicture ? (
                    <AvatarImage
                      src={selectedPost.author.profilePicture}
                      alt={`${selectedPost.author.username}'s profile picture`}
                    />
                  ) : (
                    <AvatarFallback>
                      {selectedPost.author?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/${selectedPost.author?.username}`}>
                  <div className="font-semibold text-sm truncate">
                    {selectedPost.author?.username}
                  </div>
                </Link>
                {selectedPost.location && (
                  <div className="text-xs text-muted-foreground truncate">
                    {selectedPost.location}
                  </div>
                )}
              </div>

              {/* Action buttons with proper spacing */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Post options"
                    >
                      <Icons.ThreeDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isOwnPost ? (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeletePost(
                              selectedPost._id || "",
                              selectedPost.author?._id
                            )
                          }
                          disabled={isDeleting}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isDeleting ? "Deleting..." : "Delete Post"}
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Post
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem disabled>
                          <Flag className="mr-2 h-4 w-4" />
                          Report Post
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <Icons.Share className="mr-2 h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Custom Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleClose}
                  aria-label="Close modal"
                >
                  <Icons.X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Post Info Section - Compact */}
            <div className="border-b flex-shrink-0">
              <div className="p-2 lg:p-3 max-h-24 lg:max-h-28 overflow-y-auto overflow-x-hidden">
                <div className="space-y-1 lg:space-y-2 min-w-0">
                  {/* Post caption */}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm mb-1 break-words">
                      {selectedPost.title}
                    </h3>
                    {selectedPost.caption && (
                      <p className="text-sm line-clamp-2 break-words">
                        {selectedPost.caption}
                      </p>
                    )}
                    {selectedPost.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1 break-words">
                        {selectedPost.description}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 overflow-hidden max-w-full">
                      {selectedPost.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded truncate max-w-[80px] flex-shrink-0"
                          title={tag}
                        >
                          {tag}
                        </span>
                      ))}
                      {selectedPost.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          +{selectedPost.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Section - Fixed height with scroll */}
            <div
              key={selectedPost?._id}
              className="flex-1 min-h-0 overflow-hidden"
            >
              <div
                className="h-full max-h-[45vh] sm:max-h-[40vh] md:max-h-[45vh] lg:max-h-[50vh] xl:max-h-[55vh] overflow-y-auto overflow-x-hidden p-2 lg:p-3 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="space-y-3">
                  {!selectedPost?._id ? (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      Select a post to view comments
                    </div>
                  ) : isLoadingComments ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-sm text-muted-foreground">
                        Loading comments...
                      </span>
                    </div>
                  ) : allComments.length > 0 ? (
                    <>
                      {allComments.map((comment) => {
                        const isOptimistic = comment._id.startsWith("temp-");
                        return (
                          <div key={comment._id} className="flex gap-2">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage
                                src={comment.user.profilePicture}
                                alt={comment.user.username}
                              />
                              <AvatarFallback className="text-xs">
                                {comment.user.username[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div
                                className={`bg-muted rounded-lg p-3 ${
                                  isOptimistic ? "opacity-70" : ""
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {comment.user.username}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {isOptimistic ? (
                                      <span className="flex items-center gap-1">
                                        <div className="animate-spin rounded-full h-2 w-2 border border-current border-t-transparent"></div>
                                        Sending...
                                      </span>
                                    ) : (
                                      formatDistanceToNow(
                                        new Date(comment.createdAt),
                                        {
                                          addSuffix: true,
                                        }
                                      )
                                    )}
                                  </span>
                                </div>
                                <p className="text-sm break-words">
                                  {comment.content}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 mt-1 ml-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                                  onClick={() => handleToggleLike(comment._id)}
                                  disabled={isOptimistic}
                                >
                                  <Heart className="h-3 w-3 mr-1" />
                                  {comment.likesCount || 0}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                                  disabled={isOptimistic}
                                >
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  Reply
                                </Button>
                                {user?._id === comment.user._id &&
                                  !isOptimistic && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                                        >
                                          <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-32"
                                      >
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleDeleteComment(comment._id)
                                          }
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="mr-2 h-3 w-3" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {pagination && pagination.hasMore && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-muted-foreground mt-4"
                          onClick={loadMoreComments}
                          disabled={isLoadingMore}
                        >
                          {isLoadingMore ? "Loading..." : "Load more comments"}
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      No comments yet. Be the first to comment!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions and Comment Input - Fixed at Bottom */}
            <div className="border-t bg-background flex-shrink-0">
              {/* Action Buttons - Compact on mobile/tablet */}
              <div className="p-2 lg:p-3 lg:pb-2">
                <div className="flex items-center gap-3 lg:gap-4 mb-1 lg:mb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 lg:h-10 lg:w-10"
                    onClick={() => {
                      if (selectedPost.likes?.includes(user?._id || "")) {
                        handleUnlikePost(selectedPost._id || "");
                      } else {
                        handleLikePost(selectedPost._id || "");
                      }
                    }}
                  >
                    {selectedPost.likes?.includes(user?._id || "") ? (
                      <Icons.HeartFill className="text-red-500 h-4 w-4 lg:h-5 lg:w-5" />
                    ) : (
                      <Icons.Heart className="h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 lg:h-10 lg:w-10"
                  >
                    <Icons.Comment className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 lg:h-10 lg:w-10"
                  >
                    <Icons.Share className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-8 w-8 lg:h-10 lg:w-10"
                    onClick={() =>
                      handleToggleBookmark(
                        selectedPost._id || "",
                        toggleBookmarkStatus
                      )
                    }
                    disabled={isToggling}
                  >
                    {isBookmarked ? (
                      <Icons.BookmarkFill className="text-blue-500 h-4 w-4 lg:h-5 lg:w-5" />
                    ) : (
                      <Icons.Bookmark className="h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                  </Button>
                </div>

                <div className="text-sm font-semibold mb-1">
                  {selectedPost.likes?.length || 0} likes
                </div>

                <div className="text-xs text-muted-foreground mb-2 lg:mb-3">
                  {selectedPost.createdAt
                    ? new Date(selectedPost.createdAt).toLocaleDateString()
                    : ""}
                </div>
              </div>

              {/* Comment Input - Always Visible */}
              <div className="p-2 lg:p-3 pt-0 pb-3 lg:pb-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!isPostingComment) {
                      handleSubmitComment();
                    }
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isPostingComment}
                    className="flex-1 h-9 lg:h-10"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    disabled={
                      !comment.trim() || isPostingComment || isCreatingComment
                    }
                    className="px-3 flex-shrink-0 h-9 lg:h-10"
                  >
                    {isPostingComment || isCreatingComment ? (
                      <div className="flex items-center gap-1">
                        <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent"></div>
                        Posting...
                      </div>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </form>
                {/* Socket connection status */}
                <div className="flex items-center justify-end mt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isSocketConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {isSocketConnected
                      ? "Live updates active"
                      : "Reconnecting..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPostModel;
