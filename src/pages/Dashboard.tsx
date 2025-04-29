
import React from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Dashboard/Sidebar";
import TopNav from "../components/Dashboard/TopNav";
import SummaryCards from "../components/Dashboard/SummaryCards";
import RecentTransactions from "../components/Dashboard/RecentTransactions";
import BudgetChart from "../components/Dashboard/BudgetChart";
import GoalsOverview from "../components/Dashboard/GoalsOverview";
import MotivationalTip from "../components/Dashboard/MotivationalTip";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="p-6 space-y-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SummaryCards />
            <RecentTransactions />
            <BudgetChart />
            <GoalsOverview />
            <MotivationalTip />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
