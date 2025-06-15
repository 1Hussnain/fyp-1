
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGoals } from "@/hooks/useGoals";
import { Target, TrendingUp, Calendar } from "lucide-react";

const EnhancedGoalsOverview = () => {
  const { goals, loading } = useGoals();

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
          <div className="text-center py-4">Loading goals...</div>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter(goal => !goal.is_completed);
  const totalSaved = goals.reduce((sum, goal) => sum + (Number(goal.saved_amount) || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.target_amount), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goals Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
            <div className="text-sm text-gray-600">Active Goals</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </div>
        </div>

        {activeGoals.slice(0, 3).map((goal) => {
          const progress = Math.min((Number(goal.saved_amount) / Number(goal.target_amount)) * 100, 100);
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{goal.name}</span>
                <Badge variant="outline" className="text-xs">
                  {goal.priority}
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>${Number(goal.saved_amount).toFixed(0)} saved</span>
                <span>${Number(goal.target_amount).toFixed(0)} goal</span>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default EnhancedGoalsOverview;
