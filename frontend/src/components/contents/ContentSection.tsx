import { usePost } from "@/hooks/posts/usePost";

import DemoLoginCard from "../common/DemoLoginCard";
import Feeds from "../feeds/Feeds";
import PostSkeleton from "../skeletons/PostSkeleton";
import EmptyState from "../states/EmptyState";
import Stories from "../stories/Stories";
const ContentSection = () => {
  const { posts, feedLoading } = usePost();

  if (feedLoading) {
    return <PostSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return (
      <>
        <DemoLoginCard />
        <EmptyState
          title="No posts to show"
          description="There are no posts available at this time. Follow some accounts to see their posts here."
        />
      </>
    );
  }

  return (
    <div>
      <DemoLoginCard />
      <Stories />

      <Feeds posts={posts} />
    </div>
  );
};

export default ContentSection;
