
import React from "react";
import { motion } from "framer-motion";
import { usePerformanceOptimized } from "@/hooks/usePerformanceOptimized";
import EnhancedSummaryCards from "@/components/Dashboard/EnhancedSummaryCards";
import EnhancedGoalsOverview from "@/components/Dashboard/EnhancedGoalsOverview";
import RecentTransactions from "@/components/Dashboard/RecentTransactions";
import QuickActions from "@/components/Dashboard/QuickActions";
import EnhancedBudgetAlerts from "@/components/Dashboard/EnhancedBudgetAlerts";
import EnhancedReceiptUpload from "@/components/Dashboard/EnhancedReceiptUpload";

const Dashboard = () => {
  usePerformanceOptimized('Dashboard');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <EnhancedSummaryCards />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EnhancedGoalsOverview />
          <RecentTransactions />
        </div>
        
        <div className="space-y-6">
          <QuickActions />
          <EnhancedBudgetAlerts />
          <EnhancedReceiptUpload />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
