
import React from "react";
import { motion } from "framer-motion";

const GoalsOverview = () => {
  const goals = [
    { name: "Emergency Fund", current: 12500, target: 15000, percentage: 83 },
    { name: "Home Down Payment", current: 35000, target: 60000, percentage: 58 },
    { name: "Vacation", current: 2000, target: 5000, percentage: 40 },
    { name: "New Car", current: 10000, target: 20000, percentage: 50 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="bg-white p-6 rounded-xl shadow mt-6"
    >
      <h3 className="text-lg font-semibold mb-4">Goals Overview</h3>
      <div className="space-y-5">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">{goal.name}</span>
              <span className="text-sm">{goal.percentage}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full" 
                style={{ width: `${goal.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>${goal.current.toLocaleString()}</span>
              <span>${goal.target.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GoalsOverview;
