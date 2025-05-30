import { IPost } from "@/types/post.types";

import PostCard from "../common/PostCard";

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
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No posts to show</p>
          <p className="text-sm mt-2 opacity-75">
            Follow some accounts to see their posts here
          </p>
        </div>
      )}

      {/* Extra bottom spacing for better scroll experience */}
      <div className="h-16"></div>
    </div>
  );
};

export default Feeds;
