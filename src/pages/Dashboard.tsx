
import React from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import ComponentErrorBoundary from "@/components/ui/ComponentErrorBoundary";
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
    <AppLayout pageTitle="Dashboard">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Budget Alerts */}
        <ComponentErrorBoundary componentName="Budget Alerts" minimal>
          <EnhancedBudgetAlerts />
        </ComponentErrorBoundary>
        
        {/* Mobile Quick Stats */}
        <div className="sm:hidden">
          <ComponentErrorBoundary componentName="Quick Stats" minimal>
            <MobileQuickStats />
          </ComponentErrorBoundary>
        </div>
        
        {/* Enhanced Summary Cards */}
        <ComponentErrorBoundary componentName="Summary Cards" showRetry>
          <EnhancedSummaryCards />
        </ComponentErrorBoundary>
        
        {/* Quick Actions - Mobile */}
        <div className="sm:hidden">
          <ComponentErrorBoundary componentName="Quick Actions" minimal>
            <QuickActions />
          </ComponentErrorBoundary>
        </div>
        
        {/* Main Content Grid - Improved Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Main Content (2 columns on xl screens) */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Quick Actions - Desktop */}
            <div className="hidden sm:block">
              <ComponentErrorBoundary componentName="Quick Actions" minimal>
                <QuickActions />
              </ComponentErrorBoundary>
            </div>
            
            <ComponentErrorBoundary componentName="Recent Transactions" showRetry>
              <RecentTransactions />
            </ComponentErrorBoundary>
            
            {/* Budget Chart - Full width on desktop */}
            <div className="hidden lg:block">
              <ComponentErrorBoundary componentName="Budget Chart" showRetry>
                <BudgetChart />
              </ComponentErrorBoundary>
            </div>
          </div>
          
          {/* Right Column - Sidebar Content */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <ComponentErrorBoundary componentName="Goals Overview" showRetry>
              <EnhancedGoalsOverview />
            </ComponentErrorBoundary>
            
            <ComponentErrorBoundary componentName="Receipt Upload" showRetry>
              <EnhancedReceiptUpload />
            </ComponentErrorBoundary>
            
            {/* Motivational Tip - Hide on mobile */}
            <div className="hidden sm:block">
              <ComponentErrorBoundary componentName="Motivational Tip" minimal>
                <MotivationalTip />
              </ComponentErrorBoundary>
            </div>
          </div>
        </div>

        {/* Mobile-only Budget Chart */}
        <div className="lg:hidden">
          <ComponentErrorBoundary componentName="Budget Chart" showRetry>
            <BudgetChart />
          </ComponentErrorBoundary>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;
