
import React from "react";
import { motion } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import GoalCreationForm from "@/components/goals/GoalCreationForm";
import GoalsList from "@/components/goals/GoalsList";
import MotivationalTips from "@/components/goals/MotivationalTips";

const GoalsTracker = () => {
  const {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal
  } = useGoals();

  // Patch: GoalCreationForm expects a prop 'onGoalCreate', not 'onAddGoal'
  const handleAddGoal = async (goalData: any) => {
    await addGoal(goalData);
  };

  const handleUpdateGoal = async (id: string, updates: any) => {
    await updateGoal(id, updates);
  };

  const handleDeleteGoal = async (id: string) => {
    await deleteGoal(id);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Financial Goals</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Pass as the correct prop */}
            <GoalCreationForm onGoalCreate={handleAddGoal} />
            <MotivationalTips goals={goals} />
          </div>
          <div className="lg:col-span-2">
            <GoalsList
              goals={goals}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalsTracker;
