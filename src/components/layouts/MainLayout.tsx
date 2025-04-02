import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { useState } from "react";
import { MobileSidebar, Sidebar } from "../shared/Sidebar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <div className="flex flex-1">
        <Sidebar isExpanded={isExpanded} />
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isExpanded ? "md:ml-64" : "md:ml-16"
          } ml-0`}
        >
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
