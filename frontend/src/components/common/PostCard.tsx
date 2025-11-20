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
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useComments } from "@/hooks/comments/useComments";
import { useLike } from "@/hooks/likes/useLike";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { setSelectedPost } from "@/store/slices/postSlice";
import { IPost } from "@/types/post.types";
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

const PostCard = ({ post }: { post: IPost }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { handleLikePost, handleUnlikePost } = useLike();
  const [comment, setComment] = useState("");
  const { handleCreateComment, isCreatingComment } = useComments();
  const postId = post._id || "";

  const isLiked = post.likes?.includes(user?._id || "");

  const likedColor = isLiked ? "text-red-500" : "text-muted-foreground";

  const handleOpenPost = () => {
    dispatch(setSelectedPost(post));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      handleCreateComment({ content: comment, postId });
      setComment("");
    }
  };

  return (
    <Card key={post._id} className="shadow">
      <CardHeader className="flex items-center gap-3">
        <Link to={`/${post.author?.username}`}>
          <Avatar>
            {post.author?.profilePicture ? (
              <AvatarImage
                src={post.author.profilePicture}
                alt={`${post.author.username}'s profile picture`}
              />
            ) : (
              <AvatarFallback>
                {post.author?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
        </Link>
        <div>
          <Link to={`/${post.author?.username}`}>
            <div className="font-semibold text-foreground">
              {post.author?.username}
            </div>
            {post.location && (
              <div className="text-xs text-muted-foreground">
                {post.location}
              </div>
            )}
          </Link>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
        </div>
      </CardHeader>

      <CardContent>
        <h2 className="text-lg font-bold mb-1 text-foreground">{post.title}</h2>
        {post.caption && (
          <p className="mb-2 text-muted-foreground">{post.caption}</p>
        )}
        {post.media && post.media.length > 0 && (
          <div className="w-full mb-2 relative">
            {post.media.length > 1 ? (
              <Carousel className="w-full relative">
                <CarouselContent>
                  {post.media.map((mediaItem, index) => (
                    <CarouselItem key={index}>
                      <div
                        className="w-full flex justify-center items-center rounded-md"
                        style={{ minHeight: 250, maxHeight: 400 }}
                      >
                        <img
                          src={mediaItem.url}
                          alt={`${post.title || "Post media"} - ${index + 1}`}
                          className="object-contain w-full h-full max-h-96 rounded-md cursor-pointer"
                          loading="lazy"
                          onClick={handleOpenPost}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "400px",
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
                <CarouselPrevious className="!absolute !left-2 !top-1/2 !-translate-y-1/2 !z-10 bg-black/50 hover:bg-black/70 text-white border-white/20 shadow-lg" />
                <CarouselNext className="!absolute !right-2 !top-1/2 !-translate-y-1/2 !z-10 bg-black/50 hover:bg-black/70 text-white border-white/20 shadow-lg" />
              </Carousel>
            ) : (
              <div
                className="w-full flex justify-center items-center rounded-md"
                style={{ minHeight: 250, maxHeight: 400 }}
              >
                <img
                  src={post.media[0].url}
                  alt={post.title || "Post media"}
                  className="object-contain w-full h-full max-h-96 rounded-md cursor-pointer"
                  loading="lazy"
                  onClick={handleOpenPost}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    width: "auto",
                    height: "auto",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
            )}
          </div>
        )}
        {(() => {
          const normalizedTags = normalizeTags(post.tags);
          return normalizedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {normalizedTags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded select-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          );
        })()}
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 pt-2">
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-2">
            <CardAction>
              <button
                onClick={
                  isLiked
                    ? () => handleUnlikePost(postId)
                    : () => handleLikePost(postId)
                }
                className="p-2 rounded-full hover:bg-accent transition-colors cursor-pointer"
                aria-label="Like"
              >
                {isLiked ? (
                  <Icons.HeartFill className={likedColor} />
                ) : (
                  <Icons.Heart />
                )}
              </button>
            </CardAction>
            <CardAction>
              <button
                className="p-2 rounded-full hover:bg-accent transition-colors cursor-pointer"
                aria-label="Comment"
                onClick={handleOpenPost}
              >
                <Icons.Comment />
              </button>
            </CardAction>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 text-sm">
          <span className="font-semibold">{post.likes?.length || 0}</span>
          <span className="text-muted-foreground">likes</span>
        </div>
        <div className="px-2.5 text-foreground">{post.description || ""}</div>
        <button
          className="px-2.5 text-xs text-foreground hover:underline bg-transparent h-6 border-none shadow-none cursor-pointer"
          style={{ textAlign: "left" }}
          onClick={handleOpenPost}
        >
          View all comments
          {(post.commentsCount !== undefined ? post.commentsCount : post.comments?.length || 0) > 0 && (
            <span className="ml-1 text-muted-foreground">
              ({post.commentsCount !== undefined ? post.commentsCount : post.comments?.length || 0})
            </span>
          )}
        </button>
        <div className="flex items-center w-full px-2.5 gap-2 mt-1">
          <input
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 rounded-full px-4 py-1 border border-muted bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent transition"
          />
          {isCreatingComment ? (
            <Icons.Spinner className="animate-spin h-5 w-5 text-primary" />
          ) : (
            <button
              onClick={handleSubmitComment}
              disabled={!comment.trim()}
              className="text-foreground font-semibold text-sm hover:underline px-2 py-1 rounded transition cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Post
            </button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
