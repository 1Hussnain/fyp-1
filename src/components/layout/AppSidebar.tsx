
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3, Wallet, Target, FileText, PieChart, Settings, MessageSquare, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">FinanceAI</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Smart Financial Management</p>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    tooltip={item.name}
                    isActive={isActive(item.path)}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
