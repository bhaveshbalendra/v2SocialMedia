import { Outlet } from "react-router";
import LeftSidebar from "./LeftSidebar";
import { useAuthUserRouteQuery } from "@/store/apis/authApi";
import { useSyncAuthCredentials } from "@/hooks/useSyncAuthCredentials";

const MainLayout = () => {
  const { data } = useAuthUserRouteQuery();
  useSyncAuthCredentials(data);
  return (
    <div className="container mx-auto flex h-dvh flex-col lg:flex-row lg:justify-between">
      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
        <div className="flex h-16 items-center justify-around">
          <span>Mobile Nav</span>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <LeftSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-16 pt-4 lg:pb-4">
        <Outlet />
      </main>

      {/* Right Sidebar - Optional */}
      <aside className="hidden lg:block">
        <div className="w-64">
          <span>Right Sidebar</span>
        </div>
      </aside>
    </div>
  );
};

export default MainLayout;
