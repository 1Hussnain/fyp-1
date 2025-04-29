
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Goal } from "@/hooks/useGoals";

interface MotivationalTipsProps {
  goals: Goal[];
  getRandomMotivationalTip: () => string;
}

const MotivationalTips: React.FC<MotivationalTipsProps> = ({ 
  goals, 
  getRandomMotivationalTip 
}) => {
  const [tip, setTip] = useState("");
  
  // Update the tip every 15 seconds
  useEffect(() => {
    setTip(getRandomMotivationalTip());
    
    const interval = setInterval(() => {
      setTip(getRandomMotivationalTip());
    }, 15000);
    
    return () => clearInterval(interval);
  }, [getRandomMotivationalTip]);
  
  // Don't show tips if there are no goals
  if (goals.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      className="mt-12 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm border border-purple-100">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-lg font-medium text-purple-800 mb-2">Financial Wisdom</h3>
          <p className="text-gray-700 italic">"{tip}"</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default MotivationalTips;
