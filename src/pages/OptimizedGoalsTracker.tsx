
import React from "react";
import { useGoals } from "@/hooks/useGoals";
import { Loader2 } from "lucide-react";
import OptimizedGoalForm from "@/components/goals/OptimizedGoalForm";
import OptimizedGoalsHeader from "@/components/goals/OptimizedGoalsHeader";
import OptimizedGoalsTabs from "@/components/goals/OptimizedGoalsTabs";

const OptimizedGoalsTracker = () => {
  const {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal
  } = useGoals();

  // Calculate active and completed goals from the goals array
  const activeGoals = goals.filter(goal => !goal.is_completed && (Number(goal.saved_amount ?? 0) / Number(goal.target_amount ?? 1)) * 100 < 100);
  const completedGoals = goals.filter(goal => goal.is_completed || (Number(goal.saved_amount ?? 0) / Number(goal.target_amount ?? 1)) * 100 >= 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your goals...</p>
        </div>
      </div>
    );
  }

  // PATCH: onAddGoal must have right return type { success: boolean; error?: string }
  const handleAddGoalWrapper = async (data: Omit<any, "user_id">) => {
    return await addGoal(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <OptimizedGoalsHeader 
        activeCount={activeGoals.length}
        completedCount={completedGoals.length}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <OptimizedGoalForm onAddGoal={handleAddGoalWrapper} />
        </div>
        <div className="lg:col-span-2">
          <OptimizedGoalsTabs
            activeGoals={activeGoals}
            completedGoals={completedGoals}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
          />
        </div>
      </div>
    </div>
  );
};

export default OptimizedGoalsTracker;
