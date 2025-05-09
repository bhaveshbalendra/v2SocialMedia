import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useState } from "react";
import { AiFillMessage } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown, FaSquarePlus } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { Link, useLocation } from "react-router";
import CreatePostModal from "../reuseable/CreatPost";

const navItems = [
  { label: "Home", icon: <TiHome size={24} />, path: "/" },
  { label: "Search", icon: <FaSearch size={20} />, path: "/search" },
  { label: "Messages", icon: <AiFillMessage size={22} />, path: "/messages" },
  {
    label: "Notifications",
    icon: <IoNotifications size={22} />,
    path: "/notifications",
  },
  { label: "Create", icon: <FaSquarePlus size={22} />, path: "/create" },
];

const LeftSidebar = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get user from Redux, may be null!
  const user = useAppSelector((state) => state.auth.user);

  // Extract fields safely
  const firstName = user?.firstName;
  const profilePicture = user?.profilePicture;
  const _id = user?._id;

  // Highlight active nav item
  const isActive = (path: string) => location.pathname === path;
  // For profile, highlight if path starts with /profile
  const isProfileActive = location.pathname.startsWith("/profile");

  // Dropdown close on blur (with timeout to allow click)
  const handleBlur = () => setTimeout(() => setDropdownOpen(false), 100);

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
      <div className="relative">
        <div className="flex items-center">
          <Link
            to={_id ? `/profile/${_id}` : "#"}
            className={`flex flex-1 items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 w-full text-left ${
              isProfileActive ? "bg-gray-200 font-bold" : ""
            }`}
            tabIndex={0}
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={profilePicture} alt={firstName || "User"} />
              <AvatarFallback>
                {firstName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span>{firstName || "Profile"}</span>
            <CgProfile size={22} />
          </Link>
          <button
            tabIndex={0}
            onClick={() => setDropdownOpen((open) => !open)}
            onBlur={handleBlur}
            className="px-2 py-2 rounded hover:bg-gray-100"
            aria-label="Open profile menu"
          >
            <FaChevronDown />
          </button>
        </div>
        {dropdownOpen && (
          <ul className="absolute bottom-full mb-2 left-0 w-full bg-white border rounded shadow-md z-10">
            <li>
              <Link
                to={_id ? `/profile/${_id}` : "#"}
                className="block px-3 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to={_id ? `/settings/${_id}` : "#"}
                className="block px-3 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Settings
              </Link>
            </li>
            <li>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false);
                  // Insert your logout logic here
                  alert("Logged out");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
