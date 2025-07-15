import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/auth/useLogout";
import useNotification from "@/hooks/notifications/useNotification";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useToggleTheme } from "@/hooks/themes/useToggleTheme";
import { generateRoute, PATH } from "@/routes/pathConstants";
import { FC, useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import CreatePostDialog from "../common/CreatePostDialog";
import { Icons } from "../export/Icons";
import NotificationModal from "../notifications/NotificationModal";
import UserSearchModal from "../search/UserSearchModal";
import { Button } from "../ui/button";

type User = {
  _id: string;
  firstName: string;
  profilePicture?: string;
  username: string;
};

// --- Main Sidebar ---
const LeftSidebar: FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user) as User | null;
  const { handleLogout, isLoading: isLoadingLogout } = useLogout();
  const { toggle } = useToggleTheme();
  const { unreadCount } = useNotification();

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);

  const firstName = user?.firstName || "User";
  const profilePicture = user?.profilePicture;
  const _id = user?._id;

  const isActive = (path: string) => location.pathname === path;
  const isProfileActive = location.pathname.startsWith("/profile");

  // Handler for nav item clicks
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
      if (path !== "/" && !user) {
        e.preventDefault();
        navigate(PATH.LOGIN);
      }
    },
    [user, navigate]
  );

  return (
    <aside className="max-w-60 w-full flex flex-col justify-between h-full">
      <div>
        <h1 className="font-bold text-center py-4">
          <Link to={PATH.HOME}>Social Media</Link>
        </h1>
        <nav>
          <ul>
            {/* Home */}
            <li>
              <Link
                to={PATH.HOME}
                className={`flex items-center gap-3 px-3 py-2 rounded 
                  bg-background text-foreground 
                  hover:bg-muted hover:text-foreground 
                  dark:hover:bg-muted dark:hover:text-foreground
                  ${isActive(PATH.HOME) ? "bg-muted/80 font-bold" : ""}
                `}
                onClick={(e) => handleNavClick(e, PATH.HOME)}
              >
                <Icons.Home size={24} />
                <span>Home</span>
              </Link>
            </li>
            {/* Search */}
            <li>
              <button
                type="button"
                className="flex items-center gap-3 px-3 py-2 rounded bg-background text-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground w-full"
                onClick={() => setSearchOpen(true)}
              >
                <Icons.Search size={20} />
                <span>Search</span>
              </button>
            </li>
            {/* Messages */}
            <li>
              <Link
                to={PATH.MESSAGES}
                className={`flex items-center gap-3 px-3 py-2 rounded 
                  bg-background text-foreground 
                  hover:bg-muted hover:text-foreground 
                  dark:hover:bg-muted dark:hover:text-foreground
                  ${isActive(PATH.MESSAGES) ? "bg-muted/80 font-bold" : ""}
                `}
                onClick={(e) => handleNavClick(e, PATH.MESSAGES)}
              >
                <Icons.Message size={22} />
                <span>Messages</span>
              </Link>
            </li>
            {/* Notifications */}
            <li>
              <button
                type="button"
                className="flex items-center gap-3 px-3 py-2 rounded bg-background text-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground w-full"
                onClick={() => setNotificationOpen(true)}
              >
                <div className="relative">
                  <Icons.Notifications size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span>Notifications</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {/* Profile row and dropdown */}
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Icons.Spinner className="animate-spin" />
        </div>
      ) : (
        <div className="relative px-3 flex flex-col gap-2 py-2">
          <CreatePostDialog />

          <Button onClick={toggle}>
            <Icons.DarkMode />
            DarkMode
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-3 w-full justify-between px-0 py-2 rounded hover:bg-gray-100 ${
                    isProfileActive ? "bg-gray-200 font-bold" : ""
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={profilePicture} alt={firstName} />
                      <AvatarFallback>
                        {firstName[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{firstName}</span>
                    <Icons.Profile size={22} />
                  </span>
                  <Icons.ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>{firstName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to={
                      _id
                        ? generateRoute(PATH.PROFILE, {
                            username: user.username,
                          })
                        : "#"
                    }
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={_id ? PATH.SETTINGS : "#"}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()}>
                  {isLoadingLogout ? <Icons.Spinner /> : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={PATH.LOGIN}>
              <Button className="w-full">Login</Button>
            </Link>
          )}
        </div>
      )}
      {/* Modals */}
      {/* <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} /> */}
      <UserSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationModal
        onClick={() => setNotificationOpen(!notificationOpen)}
        open={notificationOpen}
      />
    </aside>
  );
};

export default LeftSidebar;
