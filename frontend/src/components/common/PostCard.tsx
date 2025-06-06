import { Icons } from "@/components/export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBookmarks } from "@/hooks/bookmarks/useBookmarks";
import { useBookmarkStatus } from "@/hooks/bookmarks/useBookmarkStatus";
import { useLike } from "@/hooks/likes/useLike";
import { useDeletePost } from "@/hooks/posts/useDeletePost";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { setSelectedPost } from "@/store/slices/postSlice";
import { IPost } from "@/types/post.types";
import { Edit, Flag, Trash2 } from "lucide-react";
import { Link } from "react-router";

const PostCard = ({ post }: { post: IPost }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { handleLikePost, handleUnlikePost } = useLike();
  const { handleDeletePost, isDeleting } = useDeletePost();
  const { handleToggleBookmark, isToggling } = useBookmarks();
  const { isBookmarked, toggleBookmarkStatus } = useBookmarkStatus(false);

  const handleOpenPost = () => {
    dispatch(setSelectedPost(post));
  };

  const isOwnPost = user?._id === post.author?._id;

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
        <div className="ml-auto flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ""}
          </div>

          {/* Three dots menu - show for authenticated users */}
          {user && (
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
                        handleDeletePost(post._id || "", post.author?._id)
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
          )}
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
            <img
              src={post.media[0].url}
              alt={post.title || "Post media"}
              className="w-full rounded-md mb-2 object-cover max-h-96 cursor-pointer"
              loading="lazy"
              onClick={handleOpenPost}
            />
          )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 overflow-hidden max-w-full">
            {post.tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded select-none truncate max-w-[100px] flex-shrink-0"
                title={tag}
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="text-xs text-muted-foreground px-2 py-0.5 flex-shrink-0">
                +{post.tags.length - 4} more
              </span>
            )}
          </div>
        )}
        {post.description && (
          <p className="text-sm text-muted-foreground">{post.description}</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Like post titled ${post.title}`}
              onClick={() => {
                if (post.likes?.includes(user?._id || "")) {
                  handleUnlikePost(post._id || "");
                } else {
                  handleLikePost(post._id || "");
                }
              }}
            >
              {post.likes?.includes(user?._id || "") ? (
                <Icons.HeartFill />
              ) : (
                <Icons.Heart />
              )}
            </Button>
            <span className="ml-1 text-xs text-muted-foreground">
              {post.likes?.length || 0}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Comments on post titled ${post.title}`}
            onClick={handleOpenPost}
          >
            <Icons.Comment />
            <span className="ml-1 text-xs text-muted-foreground">
              {post.commentsCount}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Share post titled ${post.title}`}
          >
            <Icons.Share />
            <span className="ml-1 text-xs text-muted-foreground">
              {post.sharesCount}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Bookmark post titled ${post.title}`}
            onClick={() =>
              handleToggleBookmark(post._id || "", toggleBookmarkStatus)
            }
            disabled={isToggling}
          >
            {isBookmarked ? (
              <Icons.BookmarkFill className="text-blue-500" />
            ) : (
              <Icons.Bookmark />
            )}
            <span className="ml-1 text-xs text-muted-foreground">
              {post.bookmarksCount}
            </span>
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icons.Eye aria-hidden="true" />
          <span>{post.visibility}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
