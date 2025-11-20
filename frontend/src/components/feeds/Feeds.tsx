import { IPost } from "@/types/post.types";

import PostCard from "../common/PostCard";
import EmptyState from "../states/EmptyState";

interface FeedsProps {
  posts: IPost[];
}

const Feeds = ({ posts }: FeedsProps) => {
  return (
    <div className="max-w-xl mx-auto py-8 space-y-6 min-h-screen">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="transform transition-all duration-200 ease-out hover:scale-[1.01]"
          >
            <PostCard post={post} />
          </div>
        ))
      ) : (
        <EmptyState
          title="No posts to show"
          description="Follow some accounts to see their posts here"
        />
      )}

      {/* Extra bottom spacing for better scroll experience */}
      <div className="h-16"></div>
    </div>
  );
};

export default Feeds;
