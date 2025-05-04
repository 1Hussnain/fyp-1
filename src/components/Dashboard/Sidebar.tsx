
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Settings } from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard size={20} /> 
    },
    {
      path: "/finance-chat",
      label: "Finance Assistant",
      icon: <MessageSquare size={20} />
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <Settings size={20} />
    }
  ];

  return (
    <div 
      className={`bg-slate-800 text-white h-screen transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!isCollapsed && (
          <h1 className="text-xl font-bold">FinTrack</h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-slate-700 transition-colors"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                  ${isActive 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-300 hover:bg-slate-700"
                  }
                `}
              >
                <span>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        {!isCollapsed && (
          <div className="text-xs text-gray-400">
            FinTrack App v1.0.0
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
