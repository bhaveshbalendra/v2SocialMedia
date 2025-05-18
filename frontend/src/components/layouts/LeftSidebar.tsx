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
import { useCallback } from "react";
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

const navItems = [
  { label: "Home", icon: <TiHome size={24} />, path: "/" },
  { label: "Search", icon: <FaSearch size={20} />, path: "/search" },
  { label: "Messages", icon: <AiFillMessage size={22} />, path: "/messages" },
  {
    label: "Notifications",
    icon: <IoNotifications size={22} />,
    path: "/notifications",
  },
  // { label: "Create", icon: <FaSquarePlus size={22} />, path: "/create" },
];

const LeftSidebar = () => {
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
    (e: React.MouseEvent, path: string) => {
      if (path !== "/" && !user) {
        e.preventDefault();
        navigate("/login");
      }
      // else, let Link handle navigation
    },
    [user, navigate]
  );

  return (
    <aside className="max-w-60 w-full flex flex-col justify-between h-full">
      <div>
        <h1 className="font-bold text-center py-4">Social Media</h1>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${
                    isActive(item.path) ? "bg-gray-200 font-bold" : ""
                  }`}
                  onClick={(e) => handleNavClick(e, item.path)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <CreatePostModal />
            </li>
          </ul>
        </nav>
      </div>
      {/* Profile row and dropdown */}
      <div className="relative px-3 flex flex-col gap-2 py-2">
        <Button>
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
                <Link to={_id ? `/profile/${_id}` : "#"}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={_id ? `/settings/${_id}` : "#"}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLogout()}>
                {isLoadingLogout ? <ImSpinner2 /> : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button className="w-full">Login</Button>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
