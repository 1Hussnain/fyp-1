
import React from "react";
import { motion } from "framer-motion";
import { Search, User, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationCenter from "./NotificationCenter";

const EnhancedTopNav = () => {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const getUserDisplayName = () => {
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name;
    const firstName = user?.user_metadata?.first_name;
    const lastName = user?.user_metadata?.last_name;
    
    if (fullName) return fullName;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return user?.email?.split('@')[0] || "User";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-4 lg:px-6 py-3 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" />
          
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Dashboard
            </h2>
          </div>
          
          <div className="relative max-w-md flex-1 sm:flex-initial ml-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search transactions, goals..."
              className="pl-10 w-full sm:w-72 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-600/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationCenter />
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleDarkMode}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
                <Avatar className="h-8 w-8 ring-2 ring-gray-200 dark:ring-gray-700">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium">
                    {getUserDisplayName().slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Premium Member</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedTopNav;
