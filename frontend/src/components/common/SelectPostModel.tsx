import { Icons } from "@/components/export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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

// Helper function to normalize tags (handle both array and string formats)
const normalizeTags = (tags: string[] | string | undefined): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If JSON parsing fails, treat as comma-separated string
      return tags.split(/[#,\s]+/).map((tag: string) => tag.trim()).filter(Boolean);
    }
  }
  return [];
};

const SelectPostModel = () => {
  const { selectedPost } = useAppSelector((state) => state.post);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isLiked = selectedPost?.likes?.includes(user?._id || "");
  const { handleLikePost, handleUnlikePost } = useLike();
  const [comment, setComment] = useState("");

  const post = selectedPost;
  const postId = post?._id || "";
  const post_media = post?.media?.[0]?.url || "";
  const post_title = post?.title || "";
  const post_author = post?.author;
  const post_likes = post?.likes || [];
  const post_caption = post?.caption || "";
  const post_tags = normalizeTags(post?.tags);
  const post_description = post?.description || "";
  const post_createdAt = post?.createdAt;
  const post_location = post?.location || "";
  const post_comments = post?.comments || [];

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
      <DialogContent className="!max-w-[min(95vw,1200px)] !w-[min(95vw,1200px)] !max-h-[90vh] !h-[90vh] !p-0 overflow-hidden bg-background text-foreground flex flex-col !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !m-0 [&>button]:!size-10 [&>button]:!rounded-full [&>button]:!flex [&>button]:!items-center [&>button]:!justify-center [&>button]:!text-xl [&>button]:!font-bold [&>button]:!opacity-100 [&>button]:hover:!opacity-80 [&>button]:hover:!bg-muted [&>button_svg]:!size-5">
        <DialogTitle className="sr-only">Post Details</DialogTitle>
        <DialogDescription className="sr-only">
          View post details, comments, and interact with the post
        </DialogDescription>
        <div className="flex flex-1 min-h-0 overflow-hidden flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:flex-1 bg-background hidden md:flex items-center justify-center text-foreground relative min-h-0 overflow-hidden">
            {post?.media && post.media.length > 0 ? (
              post.media.length > 1 ? (
                <Carousel className="w-full h-full relative">
                  <CarouselContent className="h-full">
                    {post.media.map((mediaItem, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ minHeight: 250, maxHeight: 600 }}
                        >
                          <img
                            src={mediaItem.url}
                            alt={`${post_title} - ${index + 1}`}
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
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !z-10 bg-black/50 hover:bg-black/70 text-white border-white/20 shadow-lg" />
                  <CarouselNext className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !z-10 bg-black/50 hover:bg-black/70 text-white border-white/20 shadow-lg" />
                </Carousel>
              ) : (
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
              )
            ) : null}
          </div>

          {/* Content Section */}
          <div className="w-full md:w-96 min-w-[280px] max-w-[min(50vw,400px)] flex flex-col bg-background text-foreground min-h-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-start gap-3 p-4 border-b border-gray-200 mt-2 flex-shrink-0">
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
              <div className="flex-1 min-w-0">
                <Link to={`/${post_author?.username}`}>
                  <div className="font-semibold text-sm text-foreground">
                    {post_author?.username}
                  </div>
                  {post_location && (
                    <div className="text-xs text-gray-500">{post_location}</div>
                  )}
                  {post_createdAt && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(post_createdAt).toLocaleDateString()}
                    </div>
                  )}
                </Link>
              </div>
            </div>

            {/* Content - Scrollable */}
            <ScrollArea className="flex-1 min-h-0 h-0">
              <div className="p-4">
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

                {/* Comments Section */}
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {isLoadingComments ? (
                      <div className="flex items-center justify-center py-4">
                        <Icons.Spinner className="animate-spin h-5 w-5 text-primary" />
                      </div>
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
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-muted p-4 space-y-3 flex-shrink-0">
              {/* Action Buttons */}
              <div className="flex items-center">
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
