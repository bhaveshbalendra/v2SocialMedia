import React, { useCallback, useEffect, useState } from "react";

interface SearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
}

// Custom hook for debouncing
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

const Search: React.FC<SearchProps> = ({
  onSearch,
  placeholder = "Search...",
  debounceDelay = 300,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, debounceDelay);

  // Effect to call onSearch when debounced value changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className={`search-container ${className}`}>
      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="search-clear-btn"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
