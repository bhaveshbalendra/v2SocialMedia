import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useToggleBookmarkMutation } from "@/store/apis/bookmarkApi";
import { postApi } from "@/store/apis/postApi";

export const useBookmarks = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [toggleBookmark, { isLoading: isToggling }] =
    useToggleBookmarkMutation();

  const handleToggleBookmark = async (
    postId: string,
    onToggleStatus?: () => void
  ) => {
    if (!user?._id || !postId) {
      console.error("User not authenticated or invalid post ID");
      return null;
    }

    // Optimistically toggle the bookmark status in UI
    onToggleStatus?.();

    // Optimistically update the bookmark count in both feeds
    const patchResults = [
      dispatch(
        postApi.util.updateQueryData("getPublicFeed", { limit: 5 }, (draft) => {
          const post = draft.posts.find((p) => p._id === postId);
          if (post) {
            // We don't know the current bookmark status, so we'll increment first
            // and correct it based on the API response
            post.bookmarksCount = (post.bookmarksCount || 0) + 1;
          }
        })
      ),
      dispatch(
        postApi.util.updateQueryData(
          "getAuthenticatedFeed",
          { limit: 5 },
          (draft) => {
            const post = draft.posts.find((p) => p._id === postId);
            if (post) {
              post.bookmarksCount = (post.bookmarksCount || 0) + 1;
            }
          }
        )
      ),
    ];

    try {
      const result = await toggleBookmark(postId).unwrap();

      // Correct the optimistic update based on the actual result
      dispatch(
        postApi.util.updateQueryData("getPublicFeed", { limit: 5 }, (draft) => {
          const post = draft.posts.find((p) => p._id === postId);
          if (post) {
            if (result.isBookmarked) {
              // Post was bookmarked - our optimistic +1 was correct
              // No change needed
            } else {
              // Post was unbookmarked - we need to subtract 2 (remove our +1 and the actual bookmark)
              post.bookmarksCount = Math.max(0, (post.bookmarksCount || 0) - 2);
            }
          }
        })
      );

      dispatch(
        postApi.util.updateQueryData(
          "getAuthenticatedFeed",
          { limit: 5 },
          (draft) => {
            const post = draft.posts.find((p) => p._id === postId);
            if (post) {
              if (result.isBookmarked) {
                // Post was bookmarked - our optimistic +1 was correct
                // No change needed
              } else {
                // Post was unbookmarked - we need to subtract 2 (remove our +1 and the actual bookmark)
                post.bookmarksCount = Math.max(
                  0,
                  (post.bookmarksCount || 0) - 2
                );
              }
            }
          }
        )
      );

      return result.isBookmarked;
    } catch (error) {
      // Revert optimistic updates on failure
      patchResults.forEach((patchResult) => patchResult.undo());
      console.error("Failed to toggle bookmark:", error);
      return null;
    }
  };

  return {
    handleToggleBookmark,
    isToggling,
  };
};
