import { usePost } from "@/hooks/posts/usePost";

import Feeds from "../feeds/Feeds";
import PostSkeleton from "../skeletons/PostSkeleton";
import Stories from "../stories/Stories";
const ContentSection = () => {
  const { posts, feedLoading } = usePost();

  if (feedLoading) {
    return <PostSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No posts to show.
      </div>
    );
  }

  return (
    <div>
      <Stories />

      <Feeds posts={posts} />
    </div>
  );
};

export default ContentSection;
