import React from "react";
import {
  HomeIcon,
  UserGroupIcon,
  InboxIcon,
  RectangleStackIcon,
  TrophyIcon,
  ChartBarSquareIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const Ssidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/main/landing" },
    { label: "Leaderboard", icon: TrophyIcon, path: "/main/leaderboard" },
    { label: "Inbox", icon: InboxIcon, path: "/main/inbox" },
    { label: "Profile", icon: ChartBarSquareIcon, path: "/main/profile" },
  ];

  return (
    <div className="bg-gray-800 w-[250px] h-screen flex flex-col justify-between p-4 text-white">
      {/* Top Section */}
      <div>
        {/* Logo Section */}
        {/* <div className="h-20 flex items-center justify-center border-b border-gray-700">
          <button
            onClick={() => navigate("/main/landing")}
            className="flex items-center gap-3 focus:outline-none"
          >
            <HomeIcon width={30} className="text-white" />
            <p className="text-2xl font-semibold">Dashboard</p>
          </button>
        </div> */}

        {/* Navigation Buttons */}
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

      {/* Logout Button */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/logout")}
          className="flex items-center gap-3 w-full p-3 rounded-lg bg-red-600 hover:bg-red-500 focus:outline-none"
        >
          <ArrowLeftEndOnRectangleIcon width={30} className="text-white" />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Ssidebar;