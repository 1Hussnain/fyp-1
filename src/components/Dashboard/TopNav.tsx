
import React from "react";
import { motion } from "framer-motion";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import AdminRoleToggle from "../AdminRoleToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopNav = () => {
  const { user, isAdmin, signOut } = useSimpleAuth();
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

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    // Try to get name from user metadata, fallback to email
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name;
    const firstName = user?.user_metadata?.first_name;
    const lastName = user?.user_metadata?.last_name;
    
    if (fullName) return fullName;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return user?.email || "User";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-16 px-6 py-2 bg-white shadow-sm flex justify-between items-center"
    >
      <h2 className="text-xl font-semibold">Dashboard</h2>
      
      <div className="flex items-center gap-4">
        {/* Admin Role Toggle */}
        <AdminRoleToggle />
        
        <div className="relative cursor-pointer">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar>
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt="User" />
                <AvatarFallback>
                  {user?.email ? getInitials(user.email) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium">
                  {getUserDisplayName()}
                </span>
                {isAdmin && (
                  <span className="text-xs text-gray-500">Administrator</span>
                )}
              </div>
              <ChevronDown size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default TopNav;
