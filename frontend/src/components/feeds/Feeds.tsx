import { Post } from "@/types/post.types";

import PostCard from "../common/PostCard";

interface FeedsProps {
  posts: Post[];
  isLoading?: boolean;
}

const Feeds = ({ posts, isLoading }: FeedsProps) => {
  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-10">Loading...</div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No posts to show.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      {posts.map((post) => (
        <PostCard post={post} />
      ))}
    </div>
  );
};

export default Feeds;
