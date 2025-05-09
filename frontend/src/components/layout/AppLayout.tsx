import { Outlet } from "react-router";
import LeftSidebar from "./LeftSidebar";

const AppLayout = () => {
  return (
    <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between h-dvh ">
      <section className="lg:hidden ">top nav</section>
      <LeftSidebar />
      <main className="">
        <Outlet />
      </main>
      <section className="lg:hidden ">bottom nav</section>
      <section className="lg:block hidden">right sidebar</section>
    </div>
  );
};

export default AppLayout;
