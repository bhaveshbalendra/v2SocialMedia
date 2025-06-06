import { Icons } from "@/components/export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLike } from "@/hooks/likes/useLike";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { setSelectedPost } from "@/store/slices/postSlice";
import { useState } from "react";
import { Link } from "react-router";

const SelectPostModel = () => {
  const dispatch = useAppDispatch();
  const { selectedPost } = useAppSelector((state) => state.post);
  const { user } = useAppSelector((state) => state.auth);
  const { handleLikePost, handleUnlikePost } = useLike();
  const [comment, setComment] = useState("");

  const isOpen = !!selectedPost;

  const handleClose = () => {
    dispatch(setSelectedPost(null));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // TODO: Implement comment submission
      console.log("Submitting comment:", comment);
      setComment("");
    }
  };

  if (!selectedPost) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
        {/* Accessibility labels - visually hidden but available to screen readers */}
        <DialogTitle className="sr-only">
          Post by {selectedPost.author?.username}
        </DialogTitle>
        <DialogDescription className="sr-only">
          View and interact with this post including image, comments, and
          actions
        </DialogDescription>

        <div className="flex h-full">
          {/* Left side - Image */}
          <div className="flex-1 bg-black flex items-center justify-center min-w-0">
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

          {/* Right side - Post details */}
          <div className="w-96 flex flex-col flex-shrink-0">
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3">
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
              <div className="flex-1">
                <Link to={`/${selectedPost.author?.username}`}>
                  <div className="font-semibold text-sm">
                    {selectedPost.author?.username}
                  </div>
                </Link>
                {selectedPost.location && (
                  <div className="text-xs text-muted-foreground">
                    {selectedPost.location}
                  </div>
                )}
              </div>
            </div>

            {/* Post content */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Post caption */}
                <div>
                  <h3 className="font-semibold text-sm mb-1">
                    {selectedPost.title}
                  </h3>
                  {selectedPost.caption && (
                    <p className="text-sm">{selectedPost.caption}</p>
                  )}
                  {selectedPost.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedPost.description}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedPost.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Comments section - placeholder */}
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Comments will be loaded here...
                  </div>
                  {/* TODO: Map through actual comments when available */}
                </div>
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="border-t p-4 space-y-3">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (selectedPost.likes?.includes(user?._id || "")) {
                      handleUnlikePost(selectedPost._id || "");
                    } else {
                      handleLikePost(selectedPost._id || "");
                    }
                  }}
                >
                  {selectedPost.likes?.includes(user?._id || "") ? (
                    <Icons.HeartFill className="text-red-500" />
                  ) : (
                    <Icons.Heart />
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <Icons.Comment />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icons.Share />
                </Button>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Icons.Bookmark />
                </Button>
              </div>

              <div className="text-sm font-semibold">
                {selectedPost.likes?.length || 0} likes
              </div>

              <div className="text-xs text-muted-foreground">
                {selectedPost.createdAt
                  ? new Date(selectedPost.createdAt).toLocaleDateString()
                  : ""}
              </div>

              {/* Comment input */}
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  disabled={!comment.trim()}
                >
                  Post
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPostModel;
