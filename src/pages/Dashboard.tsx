
import React from "react";
import { motion } from "framer-motion";
import EnhancedSummaryCards from "../components/Dashboard/EnhancedSummaryCards";
import EnhancedBudgetAlerts from "../components/Dashboard/EnhancedBudgetAlerts";
import QuickActions from "../components/Dashboard/QuickActions";
import RecentTransactions from "../components/Dashboard/RecentTransactions";
import BudgetChart from "../components/Dashboard/BudgetChart";
import EnhancedGoalsOverview from "../components/Dashboard/EnhancedGoalsOverview";
import EnhancedReceiptUpload from "../components/Dashboard/EnhancedReceiptUpload";
import MotivationalTip from "../components/Dashboard/MotivationalTip";
import MobileQuickStats from "../components/Dashboard/MobileQuickStats";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Budget Alerts */}
      <EnhancedBudgetAlerts />
      
      {/* Mobile Quick Stats */}
      <div className="sm:hidden">
        <MobileQuickStats />
      </div>
      
      {/* Enhanced Summary Cards */}
      <EnhancedSummaryCards />
      
      {/* Quick Actions - Mobile */}
      <div className="sm:hidden">
        <QuickActions />
      </div>
      
      {/* Main Content Grid - Improved Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Content (2 columns on xl screens) */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Quick Actions - Desktop */}
          <div className="hidden sm:block">
            <QuickActions />
          </div>
          
          <RecentTransactions />
          
          {/* Budget Chart - Full width on desktop */}
          <div className="hidden lg:block">
            <BudgetChart />
          </div>
        </div>
        
        {/* Right Column - Sidebar Content */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          <EnhancedGoalsOverview />
          <EnhancedReceiptUpload />
          
          {/* Motivational Tip - Hide on mobile */}
          <div className="hidden sm:block">
            <MotivationalTip />
          </div>
        </div>
      </div>

      {/* Mobile-only Budget Chart */}
      <div className="lg:hidden">
        <BudgetChart />
      </div>
    </motion.div>
  );
};

export default Dashboard;
