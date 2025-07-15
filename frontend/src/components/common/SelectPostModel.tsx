import { Icons } from "@/components/export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useComments } from "@/hooks/comments/useComments";
import useGetComments from "@/hooks/comments/useGetComments";
import { useLike } from "@/hooks/likes/useLike";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import {
  likePost,
  setSelectedPost,
  unlikePost,
} from "@/store/slices/postSlice";
import { useState } from "react";
import { Link } from "react-router";

const SelectPostModel = () => {
  const { selectedPost } = useAppSelector((state) => state.post);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isLiked = selectedPost?.likes?.includes(user?._id || "");
  // const likedColor = isLiked ? "text-red-500" : "text-muted-foreground";
  const { handleLikePost, handleUnlikePost } = useLike();
  const [comment, setComment] = useState("");

  const post = selectedPost;
  const postId = post?._id || "";
  const post_media = post?.media?.[0]?.url || "";
  const post_title = post?.title || "";
  const post_author = post?.author;
  const post_likes = post?.likes || [];
  const post_caption = post?.caption || "";
  const post_tags = post?.tags || [];
  const post_description = post?.description || "";
  const post_createdAt = post?.createdAt;
  const post_location = post?.location || "";
  const post_comments = post?.comments || [];
  // const post_commentsCount = post?.commentsCount || 0;

  const { isLoading: isLoadingComments } = useGetComments(postId);

  const isOpen = !!selectedPost;

  const handleClose = () => {
    dispatch(setSelectedPost(null));
  };

  const { handleCreateComment, isCreatingComment } = useComments();

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      handleCreateComment({ content: comment, postId });
      setComment("");
    }
  };
  if (!selectedPost) return null;

  const handleOptimisticLike = () => {
    if (isLiked) {
      dispatch(unlikePost({ postId, userId: user?._id || "" }));
      handleUnlikePost(postId);
    } else {
      dispatch(likePost({ postId, userId: user?._id || "" }));
      handleLikePost(postId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-6xl w-full h-[90%] p-0 overflow-hidden bg-background text-foreground ">
        <DialogTitle className="sr-only">Post Details</DialogTitle>
        <DialogDescription className="sr-only">
          View post details, comments, and interact with the post
        </DialogDescription>
        <div className="flex">
          {/* Image Section */}
          <div className="md:flex-1 bg-background hidden  md:flex items-center justify-center text-foreground">
            {post?.media?.[0]?.type === "image" && post_media ? (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ minHeight: 250, maxHeight: 600 }}
              >
                <img
                  src={post_media}
                  alt={post_title}
                  className="object-contain w-full h-full max-h-[600px] max-w-full rounded-md"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "600px",
                    width: "auto",
                    height: "auto",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
            ) : null}
          </div>

          {/* Content Section */}
          <div className="w-96 flex flex-col bg-background text-foreground">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 mt-2">
              <Link to={`/${post_author?.username}`}>
                <Avatar className="w-8 h-8">
                  {post_author?.profilePicture ? (
                    <AvatarImage
                      src={post_author.profilePicture}
                      alt={`${post_author.username}'s profile picture`}
                    />
                  ) : (
                    <AvatarFallback>
                      {post_author?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
              <div className="flex-1">
                <Link to={`/${post_author?.username}`}>
                  <div className="font-semibold text-sm text-foreground">
                    {post_author?.username}
                  </div>
                  {post_location && (
                    <div className="text-xs text-gray-500">{post_location}</div>
                  )}
                </Link>
              </div>
              <div className="text-xs text-gray-400 ">
                {post_createdAt
                  ? new Date(post_createdAt).toLocaleDateString()
                  : ""}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="text-base font-bold mb-2 text-foreground">
                {post_title}
              </h2>

              {post_caption && (
                <p className="mb-3 text-sm text-muted-foreground">
                  {post_caption}
                </p>
              )}

              {post_tags && post_tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post_tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded select-none"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {post_description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {post_description}
                </p>
              )}

              {/* Comments Section - Scrollable */}
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground max-h-96 overflow-y-auto">
                  {isLoadingComments ? (
                    <Icons.Spinner className="animate-spin h-5 w-5 text-primary" />
                  ) : (
                    post_comments.map((comment, index) => (
                      <div
                        key={comment?._id || `comment-${index}`}
                        className="border-b border-muted py-2 last:border-b-0"
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-foreground">
                              {comment?.user?.username}
                            </div>
                            <div className="text-foreground text-sm mt-1">
                              {comment?.content}
                            </div>
                            <div className="text-muted-foreground text-xs mt-1">
                              {new Date(
                                comment?.createdAt
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-muted p-4 space-y-3">
              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <button
                    onClick={handleOptimisticLike}
                    className="p-2 rounded-full hover:bg-accent hover:text-primary transition-colors text-foreground"
                    aria-label="Like"
                  >
                    {isLiked ? (
                      <Icons.HeartFill className="w-5 h-5 text-red-500" />
                    ) : (
                      <Icons.Heart className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    className="p-2 rounded-full hover:bg-accent hover:text-primary transition-colors text-foreground"
                    aria-label="Share"
                  >
                    <Icons.Share className="w-5 h-5" />
                  </button>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-accent hover:text-primary transition-colors text-foreground"
                  aria-label="Bookmark"
                >
                  <Icons.Bookmark className="w-5 h-5" />
                </button>
              </div>

              {/* Likes Count */}
              <div className="text-sm">
                <span className="font-semibold">{post_likes.length || 0}</span>
                <span className="text-gray-500 ml-1">likes</span>
              </div>

              {/* Comment Input */}
              <form
                onSubmit={handleSubmitComment}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border-0 border-b border-gray-200 focus:border-b-2 focus:border-blue-500 focus:ring-0 focus:outline-none rounded-none bg-transparent py-2 text-sm placeholder-gray-400"
                />
                {isCreatingComment ? (
                  <Icons.Spinner className="animate-spin h-5 w-5 text-primary" />
                ) : (
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="text-blue-500 font-semibold text-sm hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Post
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default SelectPostModel;
