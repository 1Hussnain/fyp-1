
import React from "react";
import { motion } from "framer-motion";

interface OptimizedGoalsHeaderProps {
  activeCount: number;
  completedCount: number;
}

const OptimizedGoalsHeader: React.FC<OptimizedGoalsHeaderProps> = ({
  activeCount,
  completedCount
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and achieve your financial objectives
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {activeCount} active • {completedCount} completed
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OptimizedGoalsHeader;
