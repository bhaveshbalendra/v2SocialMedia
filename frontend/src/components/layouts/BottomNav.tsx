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
import { generateRoute, PATH } from "@/routes/pathConstants";
import { MouseEvent, useCallback } from "react";
import { AiFillMessage } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";
import { TiHome } from "react-icons/ti";
import { Link, useLocation, useNavigate } from "react-router";
import CreatePostModal from "../common/CreatePost1";
import { Button } from "../ui/button";

const navItems = [
  { label: "Home", icon: <TiHome size={24} />, path: PATH.HOME },
  { label: "Messages", icon: <AiFillMessage size={22} />, path: PATH.MESSAGES },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { handleLogout, isLoading: isLoadingLogout } = useLogout();

  const firstName = user?.firstName || "User";
  const profilePicture = user?.profilePicture;
  const _id = user?._id;

  const isActive = (path: string) => location.pathname === path;
  const isProfileActive = location.pathname.startsWith("/profile");

  // Handler for nav item clicks
  const handleNavClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, path: string) => {
      if (path !== "/" && !user) {
        e.preventDefault();
        navigate(PATH.LOGIN);
      }
    },
    [user, navigate]
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background shadow flex justify-around items-center h-16">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className={`flex flex-col items-center justify-center text-xs transition-colors
            ${
              isActive(item.path)
                ? "text-foreground font-bold"
                : "text-muted-foreground"
            }
            hover:text-foreground
          `}
          onClick={(e) => handleNavClick(e, item.path)}
        >
          {item.icon}
          <span className="mt-1">{item.label}</span>
        </Link>
      ))}
      {/* Create Post Button */}
      <CreatePostModal />

      {/* Profile Dropdown */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex flex-col items-center justify-center text-xs px-2 py-1 transition-colors
                ${
                  isProfileActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                }
                hover:text-foreground
              `}
            >
              <span className="flex items-center gap-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={profilePicture} alt={firstName} />
                  <AvatarFallback>
                    {firstName[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <FaChevronDown size={14} />
              </span>
              <span className="mt-1">Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
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
        <Link
          to="/login"
          className="flex flex-col items-center text-xs text-primary"
        >
          <Avatar className="w-6 h-6">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="mt-1">Login</span>
        </Link>
      )}
    </nav>
  );
};

export default BottomNav;
