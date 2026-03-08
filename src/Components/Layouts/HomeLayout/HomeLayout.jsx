import { Outlet } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
const HomeLayout = () => {
  return (
    <>
    <title>Home Feed | Route Posts</title>
      <Navbar />
      <Outlet />
    </>
  );
};

export default HomeLayout;
