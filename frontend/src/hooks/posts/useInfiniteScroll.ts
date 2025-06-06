import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  isLoading,
  hasMore,
  onLoadMore,
  rootMargin = "100px",
}: UseInfiniteScrollProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      // If the sentinel is visible and we can load more
      if (entry.isIntersecting && !isLoading && hasMore) {
        onLoadMore();
      }
    },
    [isLoading, hasMore, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // Use viewport as root
      rootMargin, // Load more when element is 100px from being visible
      threshold: 0.1, // Trigger when 10% of the element is visible
    });

    observer.observe(sentinel);

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [handleIntersection, rootMargin]);

  // Return the ref to be attached to a sentinel element
  return { sentinelRef };
};
