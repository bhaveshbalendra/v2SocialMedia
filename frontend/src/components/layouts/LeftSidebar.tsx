import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useLogout } from "@/hooks/useLogout";
import { useToggleTheme } from "@/hooks/useToggleTheme";
import { generateRoute, PATH } from "@/routes/pathConstants";
import { FC, useCallback, useState } from "react";
import { AiFillMessage } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";
import { IoNotifications } from "react-icons/io5";
import { MdDarkMode } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import { Link, useLocation, useNavigate } from "react-router";
import CreatePostModal from "../common/CreatePost1";
import { Button } from "../ui/button";

// --- Types ---
type ModalProps = {
  open: boolean;
  onClose: () => void;
};

type User = {
  _id: string;
  firstName: string;
  profilePicture?: string;
  username: string;
};

// --- Modal Components ---
const SearchModal: FC<ModalProps> = ({ open, onClose }) =>
  open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Search</h2>
        <input className="border p-2 w-full mb-4" placeholder="Search..." />
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  ) : null;

const NotificationModal: FC<ModalProps> = ({ open, onClose }) =>
  open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Notifications</h2>
        <div className="mb-4">You have no new notifications.</div>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  ) : null;

// --- Main Sidebar ---
const LeftSidebar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user) as User | null;
  const { handleLogout, isLoading: isLoadingLogout } = useLogout();
  const { toggle } = useToggleTheme();

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
        <h1 className="font-bold text-center py-4">Social Media</h1>
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
                <TiHome size={24} />
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
                <FaSearch size={20} />
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
                <AiFillMessage size={22} />
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
                <IoNotifications size={22} />
                <span>Notifications</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {/* Profile row and dropdown */}
      <div className="relative px-3 flex flex-col gap-2 py-2">
        <CreatePostModal />
        <Button onClick={toggle}>
          DarkMode
          <MdDarkMode />
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
                  <CgProfile size={22} />
                </span>
                <FaChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>{firstName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to={
                    _id
                      ? generateRoute(PATH.PROFILE, { username: user.username })
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
                {isLoadingLogout ? <ImSpinner2 /> : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to={PATH.LOGIN}>
            <Button className="w-full">Login</Button>
          </Link>
        )}
      </div>
      {/* Modals */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationModal
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </aside>
  );
};

export default LeftSidebar;
