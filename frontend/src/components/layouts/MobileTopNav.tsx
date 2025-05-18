import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoNotifications } from "react-icons/io5";
import { MdDarkMode } from "react-icons/md";

const MobileTopNav = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b justify-between border-gray-200 bg-white lg:hidden">
      {/* Logo or Title */}
      <h1 className="font-bold text-lg flex-shrink-0">Social Media</h1>
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search"
        className="flex-1 max-w-xs rounded-md"
      />
      {/* Notification Button */}
      <Button variant="ghost" size="icon" className="ml-1">
        <IoNotifications size={22} />
      </Button>

      <MdDarkMode />
    </div>
  );
};

export default MobileTopNav;
