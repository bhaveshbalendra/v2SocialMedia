import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import useNotification from "@/hooks/notifications/useNotification";
import { useToggleTheme } from "@/hooks/themes/useToggleTheme";
import { useState } from "react";
import { Link } from "react-router";
import { Icons } from "../export/Icons";
import NotificationModal from "../notifications/NotificationModal";
import UserSearchModal from "../search/UserSearchModal";

const MobileTopNav = () => {
  const { toggle } = useToggleTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { unreadCount } = useNotification();
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
        onFocus={() => setSearchOpen(true)}
      />
      {/* Notification Button - Only show when logged in */}
      {user && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 relative"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <Icons.Notifications size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          <NotificationModal
            open={notificationOpen}
            onClick={() => setNotificationOpen(!notificationOpen)}
          />
        </>
      )}

      <UserSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <Button onClick={toggle}>
        <Icons.DarkMode />
      </Button>
    </div>
  );
};

export default MobileTopNav;
