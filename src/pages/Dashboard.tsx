
import React from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Dashboard/Sidebar";
import TopNav from "../components/Dashboard/TopNav";
import EnhancedSummaryCards from "../components/Dashboard/EnhancedSummaryCards";
import BudgetAlerts from "../components/Dashboard/BudgetAlerts";
import QuickActions from "../components/Dashboard/QuickActions";
import RecentTransactions from "../components/Dashboard/RecentTransactions";
import BudgetChart from "../components/Dashboard/BudgetChart";
import EnhancedGoalsOverview from "../components/Dashboard/EnhancedGoalsOverview";
import ReceiptUpload from "../components/Dashboard/ReceiptUpload";
import MotivationalTip from "../components/Dashboard/MotivationalTip";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="p-4 lg:p-6 space-y-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Budget Alerts */}
            <BudgetAlerts />
            
            {/* Enhanced Summary Cards */}
            <EnhancedSummaryCards />
            
            {/* Quick Actions */}
            <QuickActions />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                <RecentTransactions />
                <BudgetChart />
              </div>
              
              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                <EnhancedGoalsOverview />
                <ReceiptUpload />
                <MotivationalTip />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
