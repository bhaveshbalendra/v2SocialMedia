import { useFeed } from "@/hooks/useFeed";

import Feeds from "../feeds/Feeds";
const ContentSection = () => {
  const { posts, feedLoading } = useFeed();

  return (
    <div>
      <h1>ContentSection</h1>
      <Feeds posts={posts} isLoading={feedLoading} />
    </div>
  );
};

export default ContentSection;
