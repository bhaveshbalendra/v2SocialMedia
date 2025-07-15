import { Icons } from "@/components/export/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserSearch } from "@/hooks/profiles/useSearchUserProfile";
import { PATH, generateRoute } from "@/routes/pathConstants";
import React from "react";
import { Link } from "react-router";

interface UserSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({ open, onClose }) => {
  const {
    searchQuery,
    searchResults,
    isSearching,
    error,
    handleSearchChange,
    clearSearch,
  } = useUserSearch(300);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Search Users</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icons.Close size={20} />
          </Button>
        </div>

        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={clearSearch}
            >
              <Icons.Close size={16} />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Icons.Spinner className="animate-spin" size={24} />
              <span className="ml-2">Searching...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500">
              <p>Error searching users. Please try again.</p>
            </div>
          )}

          {!isSearching &&
            !error &&
            searchQuery &&
            searchResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No users found for "{searchQuery}"</p>
              </div>
            )}

          {!isSearching && !error && searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <Link
                  key={user.username}
                  to={generateRoute(PATH.PROFILE, { username: user.username })}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={user.profilePicture}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>
                      {user.firstName[0]?.toUpperCase() ||
                        user.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm truncate">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      @{user.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              <Icons.Search size={48} className="mx-auto mb-2 opacity-50" />
              <p>Start typing to search for users</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
