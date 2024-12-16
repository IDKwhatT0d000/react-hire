import React, { useState } from "react";
import {
  HomeIcon,
  UserGroupIcon,
  InboxIcon,
  RectangleStackIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
const Asidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const handleLogout = async () => {
    try {
      await signOut(auth); // Logs out the user from Firebase
      navigate('/login'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/admin/landing" },
    { label: "Candidates", icon: UserGroupIcon, path: "/admin/slist" },
    { label: "Messages", icon: InboxIcon, path: "/admin/messages" },
    { label: "Offers", icon: RectangleStackIcon, path: "/admin/offers" },
  ];

  return (
        <div className="bg-gray-800 w-[250px] h-screen flex flex-col justify-between p-4 text-white">
          <div>
            <div className="mt-10 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 focus:outline-none"
                >
                  <item.icon width={30} className="text-white" />
                  <span className="text-lg font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
    
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 rounded-lg bg-red-600 hover:bg-red-500 focus:outline-none"
            >
              <ArrowLeftEndOnRectangleIcon width={30} className="text-white" />
              <span className="text-lg font-medium">Logout</span>
            </button>
          </div>
        </div>
  );
};

export default Asidebar;
