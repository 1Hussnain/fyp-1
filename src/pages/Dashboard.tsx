
import React from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import EnhancedSummaryCards from "../components/Dashboard/EnhancedSummaryCards";
import EnhancedGoalsOverview from "../components/Dashboard/EnhancedGoalsOverview";
import EnhancedBudgetAlerts from "../components/Dashboard/EnhancedBudgetAlerts";
import EnhancedReceiptUpload from "../components/Dashboard/EnhancedReceiptUpload";
import QuickActions from "../components/Dashboard/QuickActions";
import RecentTransactions from "../components/Dashboard/RecentTransactions";
import MotivationalTip from "../components/Dashboard/MotivationalTip";

const Dashboard = () => {
  return (
    <AppLayout pageTitle="Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Welcome Section */}
            <div className="text-center py-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome to Your Financial Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Track your finances, achieve your goals, and make informed decisions
              </p>
            </div>

            {/* Summary Cards */}
            <EnhancedSummaryCards />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Goals Overview */}
              <div className="lg:col-span-1 xl:col-span-1">
                <EnhancedGoalsOverview />
              </div>

              {/* Budget Alerts */}
              <div className="lg:col-span-1 xl:col-span-1">
                <EnhancedBudgetAlerts />
              </div>

              {/* Receipt Upload */}
              <div className="lg:col-span-1 xl:col-span-1">
                <EnhancedReceiptUpload />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <div className="lg:col-span-1">
                <RecentTransactions />
              </div>

              {/* Quick Actions & Motivational Tip */}
              <div className="lg:col-span-1 space-y-6">
                <QuickActions />
                <MotivationalTip />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
