
import React from "react";
import { usePerformanceOptimized } from "@/hooks/usePerformanceOptimized";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";

const Dashboard = () => {
  usePerformanceOptimized('Dashboard');

  return <DashboardOverview />;
};

export default Dashboard;
