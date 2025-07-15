import { useSyncAuthCredentials } from "@/hooks/auth/useSyncAuthCredentials";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useSocketConnect } from "@/hooks/sockets/useSocketConnect";
import { useAuthUserRouteQuery } from "@/store/apis/authApi";
import { Outlet } from "react-router";
import SelectPostModel from "../common/SelectPostModel";
import BottomNav from "./BottomNav";
import LeftSidebar from "./LeftSidebar";
import MobileTopNav from "./MobileTopNav";
import RightSidebar from "./RightSidebar";

const MainLayout = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { selectedPost } = useAppSelector((state) => state.post);
  const { data, isLoading } = useAuthUserRouteQuery(undefined, {
    skip: !isAuthenticated,
  });

  useSyncAuthCredentials(data);
  useSocketConnect();
  return (
    <div className="container mx-auto flex h-dvh flex-col lg:flex-row lg:justify-between">
      {/* <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
        <div className="flex h-16 items-center justify-around">
          <span>Mobile Nav</span>
        </div>
      </nav> */}

      <MobileTopNav />
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <LeftSidebar isLoading={isLoading} />
      </aside>

      <nav className="block lg:hidden">
        <BottomNav />
      </nav>

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto px-4 pb-16 pt-4 lg:pb-4 scroll-smooth
                       scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                       hover:scrollbar-thumb-gray-400 transition-colors duration-200"
      >
        <Outlet />
      </main>

      {/* Right Sidebar  */}
      <aside className="hidden lg:block">
        <RightSidebar />
      </aside>

      {/* Post Dialog */}
      {selectedPost && <SelectPostModel />}
    </div>
  );
};

export default MainLayout;
