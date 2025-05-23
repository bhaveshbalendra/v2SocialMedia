import { Post } from "@/types/post.types";
import { FaRegComment, FaRegHeart, FaShare } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const PostCard = ({ post }: { post: Post }) => {
  return (
    <Card key={post._id} className="shadow">
      <CardHeader className="flex items-center gap-3">
        <Avatar>
          {post.author.profilePicture ? (
            <AvatarImage
              src={post.author.profilePicture}
              alt={`${post.author.username}'s profile picture`}
            />
          ) : (
            <AvatarFallback>
              {post.author.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-semibold text-foreground">
            {post.author.username}
          </div>
          {post.location && (
            <div className="text-xs text-muted-foreground">{post.location}</div>
          )}
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </CardHeader>

      <CardContent>
        <h2 className="text-lg font-bold mb-1 text-foreground">{post.title}</h2>
        {post.caption && (
          <p className="mb-2 text-muted-foreground">{post.caption}</p>
        )}
        {post.media.length > 0 && post.media[0].type === "image" && (
          <img
            src={post.media[0].url}
            alt={post.title || "Post media"}
            className="w-full rounded-md mb-2 object-cover max-h-96"
            loading="lazy"
          />
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded select-none"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {post.description && (
          <p className="text-sm text-muted-foreground">{post.description}</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Like post titled ${post.title}`}
          >
            <FaRegHeart />
            <span className="ml-1 text-xs text-muted-foreground">
              {post.likes.length}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Comments on post titled ${post.title}`}
          >
            <FaRegComment />
            <span className="ml-1 text-xs text-muted-foreground">
              {post.commentsCount}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Share post titled ${post.title}`}
          >
            <FaShare />
            <span className="ml-1 text-xs text-muted-foreground">
              {post.sharesCount}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Bookmark post titled ${post.title}`}
          >
            <MdOutlineBookmarkBorder />
            <span className="ml-1 text-xs text-muted-foreground">
              {post.bookmarksCount}
            </span>
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <IoMdEye aria-hidden="true" />
          <span>{post.visibility}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
