import { Icons } from "@/components/export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
        {post.media &&
          post.media.length > 0 &&
          post.media[0].type === "image" && (
            <div
              className="w-full flex justify-center items-center rounded-md mb-2"
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
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded select-none"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
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
            <CardAction>
              <button
                className="p-2 rounded-full hover:bg-accent transition-colors cursor-pointer"
                aria-label="Share"
              >
                <Icons.Share />
              </button>
            </CardAction>
          </div>
          <CardAction>
            <button
              className="p-2 rounded-full hover:bg-accent transition-colors cursor-pointer"
              aria-label="Bookmark"
            >
              <Icons.Bookmark />
            </button>
          </CardAction>
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
          {post.comments && (
            <span className="ml-1 text-muted-foreground">
              ({post.comments.length})
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
