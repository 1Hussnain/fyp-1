
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
      <MobileQuickStats />
      
      {/* Enhanced Summary Cards */}
      <EnhancedSummaryCards />
      
      {/* Quick Actions - Mobile Optimized */}
      <div className="block sm:hidden">
        <QuickActions />
      </div>
      
      {/* Main Content Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          {/* Quick Actions - Desktop */}
          <div className="hidden sm:block">
            <QuickActions />
          </div>
          
          <RecentTransactions />
          
          {/* Budget Chart - Hide on mobile, show on tablet+ */}
          <div className="hidden md:block">
            <BudgetChart />
          </div>
        </div>
        
        {/* Right Column - Sidebar Content */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <EnhancedGoalsOverview />
          <EnhancedReceiptUpload />
          
          {/* Motivational Tip - Hide on mobile */}
          <div className="hidden sm:block">
            <MotivationalTip />
          </div>
        </div>
      </div>

      {/* Mobile-only Budget Chart */}
      <div className="block md:hidden">
        <BudgetChart />
      </div>
    </motion.div>
  );
};

export default Dashboard;
