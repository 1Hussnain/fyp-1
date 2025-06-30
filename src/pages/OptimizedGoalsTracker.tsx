
import React from "react";
import { usePerformanceOptimized } from "@/hooks/usePerformanceOptimized";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, AlertCircle } from "lucide-react";
import { useStableGoals } from "@/hooks/useStableGoals";
import OptimizedGoalsTabs from "@/components/goals/OptimizedGoalsTabs";
import OptimizedGoalsHeader from "@/components/goals/OptimizedGoalsHeader";
import FastLoadingSpinner from "@/components/ui/FastLoadingSpinner";

const OptimizedGoalsTracker = () => {
  usePerformanceOptimized('OptimizedGoalsTracker');

  const { goals, loading, error, updateGoal, deleteGoal } = useStableGoals();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FastLoadingSpinner size="lg" text="Loading your goals..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error Loading Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Separate active and completed goals
  const activeGoals = goals.filter(goal => 
    !goal.is_completed && 
    (Number(goal.saved_amount) / Number(goal.target_amount)) * 100 < 100
  );
  
  const completedGoals = goals.filter(goal => 
    goal.is_completed || 
    (Number(goal.saved_amount) / Number(goal.target_amount)) * 100 >= 100
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <OptimizedGoalsHeader 
        activeCount={activeGoals.length}
        completedCount={completedGoals.length}
      />
      
      {/* Goals Content */}
      {goals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
            <p className="text-gray-600 mb-6">
              Start your financial journey by creating your first goal!
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <OptimizedGoalsTabs
          activeGoals={activeGoals}
          completedGoals={completedGoals}
          onUpdateGoal={updateGoal}
          onDeleteGoal={deleteGoal}
        />
      )}
    </div>
  );
};

export default OptimizedGoalsTracker;
