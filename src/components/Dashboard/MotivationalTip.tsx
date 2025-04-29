
import React from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const MotivationalTip = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
      className="bg-blue-50 border border-blue-200 p-4 rounded-xl mt-6 flex items-start gap-3"
    >
      <div className="bg-blue-100 rounded-full p-2">
        <Lightbulb size={20} className="text-blue-500" />
      </div>
      <div>
        <p className="font-medium text-blue-800">AI Financial Tip</p>
        <p className="text-blue-700 text-sm">
          You're 83% closer to your Emergency Fund goal. Keep up the momentum! Consider allocating an additional 5% of your monthly income to reach your target faster.
        </p>
      </div>
    </motion.div>
  );
};

export default MotivationalTip;
