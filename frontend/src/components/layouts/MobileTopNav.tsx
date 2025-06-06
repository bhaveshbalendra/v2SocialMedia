import UserSearchModal from "@/components/search/UserSearchModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useNotification from "@/hooks/notifications/useNotification";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useToggleTheme } from "@/hooks/themes/useToggleTheme";
import { useState } from "react";
import { Link } from "react-router";
import { Icons } from "../export/Icons";
import NotificationModal from "../notifications/NotificationModal";

const MobileTopNav = () => {
  const { toggle } = useToggleTheme();
  const { unreadCount } = useNotification();
  const { user } = useAppSelector((state) => state.auth);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b justify-between lg:hidden">
      {/* Logo or Title */}
      <h1 className="font-bold text-lg flex-shrink-0">
        <Link to="/">Social Media</Link>
      </h1>
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search"
        className="flex-1 max-w-xs rounded-md"
        onClick={() => setSearchOpen(true)}
        readOnly
      />
      {/* Notification Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`ml-1 relative ${
          !user ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => user && setNotificationOpen(!notificationOpen)}
        disabled={!user}
      >
        <Icons.Notifications size={22} />
        {user && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {user && (
        <NotificationModal
          open={notificationOpen}
          onClick={() => setNotificationOpen(!notificationOpen)}
        />
      )}

      <Button onClick={toggle}>
        <Icons.DarkMode />
      </Button>

      {/* Search Modal */}
      <UserSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default MobileTopNav;
