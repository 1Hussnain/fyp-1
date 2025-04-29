
import React from "react";
import { motion } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import GoalCreationForm from "@/components/goals/GoalCreationForm";
import GoalsList from "@/components/goals/GoalsList";
import MotivationalTips from "@/components/goals/MotivationalTips";

const GoalsTracker = () => {
  const {
    goals,
    formData,
    handleFormChange,
    handleAddGoal,
    handleAddSavings,
    getRandomMotivationalTip,
    deletedGoalName,
    setDeletedGoalName,
  } = useGoals();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Financial Goals Tracker</h1>
          <p className="text-gray-600">Set, track, and achieve your financial dreams one milestone at a time.</p>
        </header>

        <GoalCreationForm 
          formData={formData} 
          handleFormChange={handleFormChange} 
          handleAddGoal={handleAddGoal} 
        />

        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-800">Your Active Goals</h2>
            <GoalsList goals={goals} handleAddSavings={handleAddSavings} />
          </motion.div>
        )}
        
        {goals.length === 0 && (
          <motion.div 
            className="mt-10 p-8 bg-gray-50 rounded-xl border border-gray-200 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Goals Set Yet</h3>
            <p className="text-gray-500 mb-4">Create your first financial goal above to start tracking your progress.</p>
            <p className="text-sm text-purple-600">Setting clear goals is the first step toward financial success!</p>
          </motion.div>
        )}

        <MotivationalTips goals={goals} getRandomMotivationalTip={getRandomMotivationalTip} />
      </motion.div>
    </div>
  );
};

export default GoalsTracker;
