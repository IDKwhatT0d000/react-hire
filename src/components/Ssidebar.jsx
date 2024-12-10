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
  const navigate = useNavigate(); // React Router navigation hook

  return (
    <div className="bg-slate-800 w-14 sm:w-20 h-screen flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Home Icon */}
        <div className="h-20 items-center flex justify-center">
          <button
            onClick={() => navigate("/main/landing")}
            className="focus:outline-none"
          >
            <HomeIcon width={40} className="text-gray-300" />
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex flex-col items-center space-y-4">
          <button
            onClick={() => navigate("/main/leaderboard")}
            className="bg-gray-600 p-2 rounded-lg text-gray-300 hover:bg-gray-500 focus:outline-none"
          >
            <TrophyIcon width={40} />
          </button>
          <button
            onClick={() => navigate("/main/inbox")}
            className="bg-gray-600 p-2 rounded-lg text-gray-300 hover:bg-gray-500 focus:outline-none"
          >
            <InboxIcon width={40} />
          </button>
          <button
            onClick={() => navigate("/main/profile")}
            className="bg-gray-600 p-2 rounded-lg text-gray-300 hover:bg-gray-500 focus:outline-none"
          >
            <ChartBarSquareIcon width={40} />
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => navigate("/logout")}
          className="bg-red-600 text-white rounded-lg p-2 hover:bg-red-500 focus:outline-none"
        >
          <ArrowLeftEndOnRectangleIcon width={40} />
        </button>
      </div>
    </div>
  );
};

export default Ssidebar;
