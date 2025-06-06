import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useGetUserBookmarksQuery } from "@/store/apis/bookmarkApi";
import { setSelectedPost } from "@/store/slices/postSlice";
import { IPost } from "@/types/post.types";
import { useState } from "react";

const BookmarksPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data: bookmarksData,
    isLoading,
    error,
    refetch,
  } = useGetUserBookmarksQuery({ page, limit }, { skip: !user?._id });

  const handlePostClick = (post: IPost) => {
    dispatch(setSelectedPost(post));
  };

  const handleLoadMore = () => {
    if (bookmarksData?.pagination.hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view your bookmarks
          </h1>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Bookmarks</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="aspect-square">
              <CardContent className="p-0">
                <Skeleton className="w-full h-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading bookmarks</h1>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const bookmarks = bookmarksData?.bookmarks || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground">
            Start bookmarking posts you want to save for later!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bookmarks.map((post) => (
              <Card
                key={post._id}
                className="aspect-square cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePostClick(post)}
              >
                <CardContent className="p-0 h-full">
                  {post.media &&
                  post.media.length > 0 &&
                  post.media[0].type === "image" ? (
                    <img
                      src={post.media[0].url}
                      alt={post.title || "Bookmarked post"}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="font-semibold text-sm mb-1">
                          {post.title}
                        </h3>
                        {post.caption && (
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {post.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {bookmarksData?.pagination.hasMore && (
            <div className="text-center mt-8">
              <Button onClick={handleLoadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}

          <div className="text-center mt-4 text-sm text-muted-foreground">
            {bookmarks.length} of {bookmarksData?.pagination.total} bookmarks
          </div>
        </>
      )}
    </div>
  );
};

export default BookmarksPage;
