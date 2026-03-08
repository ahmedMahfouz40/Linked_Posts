import { Navigate, Outlet } from "react-router-dom";
import Leading from "../../../Pages/Leading/Leading";

const MainLayout = () => {
  function toggleToRegister() {
    console.log("register");

    <Navigate to="/register" />;
  }
  function toggleToLogin() {
    console.log("Login");
    <Navigate to="/login" />;
  }

  return (
    <>
      <div className="min-h-screen  bg-[#f0f2f5] px-4  sm:py-12 flex flex-col lg:flex-row lg:items-center   ">
        <div className="w-full   order-2 lg:order-1 ">
          <Leading />
        </div>
        <div className="w-full  order-1 lg:order-1">
          <Outlet
            toggleToLogin={toggleToLogin}
            toggleToRegister={toggleToRegister}
          />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
