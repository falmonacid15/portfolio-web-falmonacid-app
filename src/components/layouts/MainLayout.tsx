import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../shared/Navbar";

const MainLayout = () => {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login";

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
