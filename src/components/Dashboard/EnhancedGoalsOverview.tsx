
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSimpleGoals } from "@/hooks/useSimpleGoals";
import { Target, TrendingUp, Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FastLoadingSpinner from "@/components/ui/FastLoadingSpinner";

const EnhancedGoalsOverview = () => {
  const { goals, loading } = useSimpleGoals();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <FastLoadingSpinner size="sm" text="Loading goals..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter(goal => !goal.is_completed && (Number(goal.saved_amount) / Number(goal.target_amount)) * 100 < 100);
  const completedGoals = goals.filter(goal => goal.is_completed || (Number(goal.saved_amount) / Number(goal.target_amount)) * 100 >= 100);
  const totalSaved = goals.reduce((sum, goal) => sum + (Number(goal.saved_amount) || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.target_amount), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals Overview
          </CardTitle>
          <Button
            size="sm"
            onClick={() => navigate('/goals')}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-6">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No financial goals yet</p>
            <Button
              onClick={() => navigate('/goals')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{overallProgress}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Recent Goals</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/goals')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View All
                </Button>
              </div>
              
              {activeGoals.slice(0, 3).map((goal) => {
                const progress = Math.min((Number(goal.saved_amount) / Number(goal.target_amount)) * 100, 100);
                const daysLeft = goal.deadline 
                  ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : null;

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                        {goal.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {goal.priority}
                        </Badge>
                        {daysLeft && daysLeft > 0 && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {daysLeft}d
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>${Number(goal.saved_amount).toLocaleString()} saved</span>
                      <span>${Number(goal.target_amount).toLocaleString()} goal</span>
                    </div>
                  </motion.div>
                );
              })}

              {activeGoals.length === 0 && completedGoals.length < goals.length && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All goals completed! 🎉
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedGoalsOverview;
