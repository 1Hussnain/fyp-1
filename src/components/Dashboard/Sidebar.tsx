
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart3, Wallet, Target, FileText, PieChart, Settings } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = React.useState("Dashboard");

  const navItems = [
    { name: "Dashboard", icon: BarChart3, path: "/dashboard" },
    { name: "Budgets", icon: Wallet, path: "/budgets" },
    { name: "Goals", icon: Target, path: "/goals" },
    { name: "Documents", icon: FileText, path: "/documents" },
    { name: "Reports", icon: PieChart, path: "/reports" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  const handleNavigation = (item: string, path: string) => {
    setActiveItem(item);
    navigate(path);
  };

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white shadow h-screen fixed md:relative z-10 overflow-y-auto"
    >
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-blue-600">FinanceAI</h1>
      </div>
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <div
                className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${
                  activeItem === item.name ? "bg-blue-100 text-blue-600" : ""
                }`}
                onClick={() => handleNavigation(item.name, item.path)}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;
