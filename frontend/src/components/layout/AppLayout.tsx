import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground antialiased">
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
