
import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import EnhancedTopNav from "../Dashboard/EnhancedTopNav";

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  pageTitle
}) => {
  const location = useLocation();

  // Don't show layout on the index/login page
  if (location.pathname === "/") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <EnhancedTopNav />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {pageTitle && (
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {pageTitle}
                </h1>
              </div>
            )}
            <div className="space-y-4 sm:space-y-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
