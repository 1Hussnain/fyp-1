
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart3, Wallet, Target, FileText, PieChart, Settings, MessageSquare, Home, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Dashboard", icon: BarChart3, path: "/dashboard" },
    { name: "Financial Management", icon: Wallet, path: "/financial-management" },
    { name: "Goals Tracker", icon: Target, path: "/goals-tracker" },
    { name: "Budget Summary", icon: PieChart, path: "/budget-summary" },
    { name: "Documents", icon: FileText, path: "/document-viewer" },
    { name: "Finance Chat", icon: MessageSquare, path: "/finance-chat" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  const handleNavigation = (item: string, path: string) => {
    setActiveItem(item);
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Mobile toggle button
  if (isMobile) {
    return (
      <>
        {/* Mobile toggle button */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </Button>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Mobile sidebar */}
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
              >
                <div className="p-4 border-b dark:border-gray-700">
                  <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">FinanceAI</h1>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.name}>
                        <div
                          className={`flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors ${
                            activeItem === item.name ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                          }`}
                          onClick={() => handleNavigation(item.name, item.path)}
                        >
                          <item.icon size={20} />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop sidebar - now sticky
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white dark:bg-gray-900 shadow-lg h-screen fixed top-0 left-0 z-20 overflow-y-auto border-r dark:border-gray-700"
    >
      <div className="p-6 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">FinanceAI</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Smart Financial Management</p>
      </div>
      <div className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeItem === item.name ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => handleNavigation(item.name, item.path)}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;
