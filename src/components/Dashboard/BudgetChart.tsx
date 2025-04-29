
import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

const BudgetChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="bg-white p-6 rounded-xl shadow mt-6"
    >
      <h3 className="text-lg font-semibold mb-4">Monthly Budget vs. Actual</h3>
      <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center flex-col">
        <BarChart3 size={48} className="text-gray-400 mb-2" />
        <p className="text-gray-500">Budget vs Actual - April 2025</p>
        <p className="text-xs text-gray-400 mt-1">
          Chart visualization will appear here
        </p>
      </div>
    </motion.div>
  );
};

export default BudgetChart;
