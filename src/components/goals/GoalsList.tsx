
import React from "react";
import { motion } from "framer-motion";
import GoalCard from "./GoalCard";
import { FinancialGoal } from "@/types/database";

interface GoalsListProps {
  goals: FinancialGoal[];
  onUpdateGoal: (id: string, updates: Partial<FinancialGoal>) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, onUpdateGoal, onDeleteGoal }) => {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No goals yet. Create your first financial goal!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal, index) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GoalCard
            goal={goal}
            onUpdateGoal={onUpdateGoal}
            onDeleteGoal={onDeleteGoal}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default GoalsList;
