import LeftSidebar from "../../LeftSidebar/LeftSidebar";
import RightSidebar from "../../RightSidebar/RightSidebar";
import CreatePost from "../../Posts/CreatePost";
import { Outlet } from "react-router-dom";
const FeedLayout = () => {
  return (
    <div>
   

      <section className=" px-3 sm:px-5 md:px-10 xl:px-20 grid gap-3  grid-cols-8 my-20">
        {/* Left Sidebar */}
        <aside className=" order-1 col-span-8 xl:col-span-2 h-fit space-y-3 xl:sticky xl:top-21 xl:block">
          <LeftSidebar />
        </aside>
        {/* Content */}
        <div className=" order-2 col-span-8 xl:col-span-4 ">
          <CreatePost />
          <Outlet />
        </div>
        {/* Right Sidebar */}
        <aside className="order-3 col-span-2 hidden h-fit xl:sticky xl:top-21 xl:block ">
          <RightSidebar />
        </aside>
      </section>
    </div>
  );
};

export default FeedLayout;
