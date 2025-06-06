import { useLazySearchUsersQuery } from "@/store/apis/profileApi";
import { useCallback, useEffect, useState } from "react";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface SearchUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  isPrivate: boolean;
}

export const useUserSearch = (debounceDelay: number = 300) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, debounceDelay);
  const [triggerSearch, { isLoading, error }] = useLazySearchUsersQuery();

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim()) {
        setIsSearching(true);
        try {
          const result = await triggerSearch({
            q: debouncedSearchQuery,
            limit: 10,
          }).unwrap();
          setSearchResults(result.data || []);
        } catch (err) {
          console.error("Search error:", err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery, triggerSearch]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching: isSearching || isLoading,
    error,
    handleSearchChange,
    clearSearch,
  };
};
