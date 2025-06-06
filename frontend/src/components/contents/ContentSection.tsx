import { useInfiniteScroll } from "@/hooks/posts/useInfiniteScroll";
import { usePost } from "@/hooks/posts/usePost";
import { useAppSelector } from "@/hooks/redux/useAppSelector";

import Feeds from "../feeds/Feeds";
import PostSkeleton from "../skeletons/PostSkeleton";
import Stories from "../stories/Stories";

const ContentSection = () => {
  const { posts, feedLoading, hasMore, loadMorePosts } = usePost();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Initialize infinite scroll with Intersection Observer
  const { sentinelRef } = useInfiniteScroll({
    isLoading: feedLoading,
    hasMore,
    onLoadMore: loadMorePosts,
    rootMargin: "200px", // Load more when 200px from bottom
  });

  if (feedLoading && posts.length === 0) {
    return <PostSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No posts to show.</p>
        <p className="text-sm mt-2">
          {isAuthenticated
            ? "Follow some users to see their posts"
            : "Public posts will appear here"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Stories />

      <Feeds posts={posts} />

      {/* Intersection Observer Sentinel - invisible element that triggers loading */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-10 flex items-center justify-center"
        >
          {feedLoading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">
                Loading more {isAuthenticated ? "personalized" : "public"}{" "}
                posts...
              </span>
            </div>
          )}
        </div>
      )}

      {/* End of feed indicator */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You've reached the end!</p>
          <p className="text-sm mt-1">
            {isAuthenticated
              ? "No more posts from your network"
              : "No more public posts available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentSection;
