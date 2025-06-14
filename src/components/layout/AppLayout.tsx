
import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Dashboard/Sidebar";
import EnhancedTopNav from "../Dashboard/EnhancedTopNav";

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, pageTitle }) => {
  const location = useLocation();
  
  // Don't show layout on the index/login page
  if (location.pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <EnhancedTopNav />
        <main className="p-3 sm:p-4 lg:p-6 overflow-y-auto flex-1">
          {pageTitle && (
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{pageTitle}</h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
