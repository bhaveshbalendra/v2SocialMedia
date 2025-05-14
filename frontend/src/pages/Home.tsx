import { useFeed } from "@/hooks/useFeed";
import { Loader2 } from "lucide-react";
// import { useEffect, useState } from "react";

const HomePage = () => {
  // const [page, setPage] = useState(1);
  const { posts, isLoading, error, hasMore, loadMore, refresh } = useFeed(page);

  // // Infinite scroll handler
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + document.documentElement.scrollTop ===
  //       document.documentElement.offsetHeight
  //     ) {
  //       if (hasMore && !isLoading) {
  //         setPage((prev) => prev + 1);
  //       }
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [hasMore, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-destructive">Error loading feed</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* {posts?.map((post) => (
        <div key={post._id} className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <img
              src={post.author.profilePicture || "/default-avatar.png"}
              alt={post.author.username}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{post.author.username}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="mt-2">{post.content}</p>
          {post.media && post.media.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {post.media.map((media, index) => (
                <img
                  key={index}
                  src={media}
                  alt={`Post media ${index + 1}`}
                  className="rounded-lg"
                />
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center space-x-4">
            <button className="flex items-center space-x-1">
              <span>❤️</span>
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-1">
              <span>💬</span>
              <span>{post.comments}</span>
            </button>
          </div>
        </div>
      ))} */}
      home
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default HomePage;
