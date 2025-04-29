
import React from "react";
import { motion } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import GoalCard from "@/components/goals/GoalCard";
import { Goal } from "@/hooks/useGoals";

interface GoalsListProps {
  goals: Goal[];
  handleAddSavings: (goalId: string, amount?: number) => void;
  handleDeleteGoal: (goalId: string) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, handleAddSavings, handleDeleteGoal }) => {
  const { getProgress, daysLeft } = useGoals();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          progress={getProgress(goal)}
          daysLeft={daysLeft(goal.deadline)}
          onAddSavings={handleAddSavings}
          onDeleteGoal={handleDeleteGoal}
        />
      ))}
    </motion.div>
  );
};

export default GoalsList;
