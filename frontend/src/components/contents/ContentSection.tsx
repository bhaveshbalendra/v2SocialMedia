import { usePost } from "@/hooks/usePost";

import Feeds from "../feeds/Feeds";
import Stories from "../stories/Stories";
const ContentSection = () => {
  const { posts, feedLoading } = usePost();

  return (
    <div>
      <Stories />

      <Feeds posts={posts} isLoading={feedLoading} />
    </div>
  );
};

export default ContentSection;
