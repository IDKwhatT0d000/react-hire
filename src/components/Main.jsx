import React from "react";
import { Outlet } from "react-router-dom"; // For rendering dynamic routes
import Asidebar from "./Asidebar";
import Ssidebar from "./Ssidebar";
import Navbar from "./Navbar";

const Main = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar (always visible) */}
      <Ssidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 relative">
        <Navbar />
        <div className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
