import React from 'react'
import Asidebar from "./Asidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
const Ahome = () => {
  return (
    <div className="flex h-screen">
      <Asidebar />
      <div className="flex flex-col flex-1 relative">
        <Navbar />
        <div className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Ahome