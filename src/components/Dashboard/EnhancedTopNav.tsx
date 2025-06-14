
import React from "react";
import { motion } from "framer-motion";
import { Search, User, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import NotificationCenter from "./NotificationCenter";

const EnhancedTopNav = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 px-4 lg:px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 hidden sm:block">
            Financial Dashboard
          </h2>
          <div className="relative max-w-md flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search transactions, goals..."
              className="pl-10 w-full sm:w-64 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationCenter />
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleDarkMode}
            className="dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          
          <Button variant="outline" size="sm" className="dark:border-gray-600 dark:hover:bg-gray-700">
            <Settings className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="dark:bg-gray-700">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedTopNav;
