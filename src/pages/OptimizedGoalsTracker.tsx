
import React from "react";
import { motion } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Calendar, DollarSign, Loader2, Plus } from "lucide-react";
import OptimizedGoalForm from "@/components/goals/OptimizedGoalForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const getProgress = (goal: any) => {
    return Math.min((Number(goal.saved_amount) / Number(goal.target_amount)) * 100, 100);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddGoalWrapper = async (data: any) => {
    const result = await addGoal(data);
    return result.success;
  };

  const GoalCard = ({ goal, showActions = true }: { goal: any; showActions?: boolean }) => {
    const progress = getProgress(goal);
    const daysLeft = goal.deadline ? getDaysUntilDeadline(goal.deadline) : null;
    const isOverdue = daysLeft !== null && daysLeft < 0;
    const isComplete = goal.is_completed || progress >= 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        <Card className={`transition-all duration-200 hover:shadow-md ${
          isComplete ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 
          isOverdue ? 'border-red-200 bg-red-50/50 dark:bg-red-900/10' : 
          'hover:border-blue-200'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{goal.name}</CardTitle>
                {goal.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {goal.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={
                  goal.priority === 'high' ? 'destructive' : 
                  goal.priority === 'medium' ? 'default' : 
                  'secondary'
                }>
                  {goal.priority}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {goal.goal_type}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>
                  ${Number(goal.saved_amount).toFixed(2)} of ${Number(goal.target_amount).toFixed(2)}
                </span>
              </div>
              {goal.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className={
                    isOverdue ? 'text-red-600 font-medium' : 
                    daysLeft !== null && daysLeft <= 7 ? 'text-orange-600 font-medium' : 
                    'text-gray-600'
                  }>
                    {isOverdue ? `${Math.abs(daysLeft!)} days overdue` : 
                     daysLeft === 0 ? 'Due today' : 
                     daysLeft !== null ? `${daysLeft} days left` : 'No deadline'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-bold">{progress.toFixed(1)}%</span>
              </div>
              <Progress 
                value={progress} 
                className={`h-3 ${
                  isComplete ? '[&>div]:bg-green-500' : 
                  isOverdue ? '[&>div]:bg-red-500' : 
                  '[&>div]:bg-blue-500'
                }`}
              />
            </div>

            {showActions && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const amount = prompt('Enter amount to add:');
                    if (amount && !isNaN(Number(amount))) {
                      updateGoal(goal.id, {
                        saved_amount: Number(goal.saved_amount) + Number(amount)
                      });
                    }
                  }}
                  disabled={isComplete}
                >
                  Add Savings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
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
              {activeGoals.length} active • {completedGoals.length} completed
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <OptimizedGoalForm onAddGoal={handleAddGoalWrapper} />
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Active Goals ({activeGoals.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Completed ({completedGoals.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6">
                {activeGoals.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No active goals yet</p>
                      <p className="text-sm text-gray-400">
                        Create your first financial goal to start tracking your progress
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {activeGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                {completedGoals.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No completed goals yet</p>
                      <p className="text-sm text-gray-400">
                        Your achieved goals will appear here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {completedGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} showActions={false} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OptimizedGoalsTracker;
