import { useLazySearchUserProfilesQuery } from "@/store/apis/profileApi";
import { ISearchProfile } from "@/types/profile.types";
import { useEffect, useState } from "react";

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

export const useUserSearch = (debounceDelay: number = 300) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ISearchProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [triggerSearch, { isLoading, error }] =
    useLazySearchUserProfilesQuery();
  const debouncedSearchQuery = useDebounce(searchQuery, debounceDelay);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim()) {
        setIsSearching(true);
        try {
          const result = await triggerSearch({
            searchTerm: debouncedSearchQuery,
          }).unwrap();
          setSearchResults(result.profiles || []);
        } catch (error) {
          console.error("Error searching user profiles:", error);
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  return {
    searchQuery,
    searchResults,
    isSearching: isSearching || isLoading,
    isLoading,
    error,
    handleSearchChange,
    clearSearch,
  };
};
