
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
            <div className="mb-6 flex flex-wrap gap-3">
              <Link to="/income-expenses">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Income & Expenses
                </button>
              </Link>
              <Link to="/budget-tracker">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Budget Tracker
                </button>
              </Link>
              <Link to="/goals-tracker">
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  Goals Tracker
                </button>
              </Link>
              <Link to="/budget-summary">
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  Budget Summary
                </button>
              </Link>
            </div>
            
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
