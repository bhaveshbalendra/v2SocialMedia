import { useCallback, useState } from "react";

/**
 * Hook to track bookmark status locally for optimistic UI updates
 */
export const useBookmarkStatus = (initialStatus: boolean = false) => {
  const [isBookmarked, setIsBookmarked] = useState(initialStatus);

  const setBookmarkStatus = useCallback((status: boolean) => {
    setIsBookmarked(status);
  }, []);

  const toggleBookmarkStatus = useCallback(() => {
    setIsBookmarked((prev) => !prev);
  }, []);

  return {
    isBookmarked,
    setBookmarkStatus,
    toggleBookmarkStatus,
  };
};
