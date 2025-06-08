
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, DollarSign } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  goalType: string;
}

interface GoalProgressSummaryProps {
  goals: Goal[];
}

const GoalProgressSummary: React.FC<GoalProgressSummaryProps> = ({ goals }) => {
  const activeGoals = goals.filter(goal => (goal.saved / goal.target) * 100 < 100);
  const completedGoals = goals.filter(goal => (goal.saved / goal.target) * 100 >= 100);

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goal Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
            <div className="text-sm text-gray-600">Active Goals</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              ${goals.reduce((sum, goal) => sum + goal.saved, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Saved</div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Active Goals</h4>
          {activeGoals.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active goals. Consider setting some financial targets!</p>
          ) : (
            <div className="space-y-3">
              {activeGoals.slice(0, 5).map((goal) => {
                const progress = (goal.saved / goal.target) * 100;
                const daysRemaining = getDaysRemaining(goal.deadline);
                
                return (
                  <div key={goal.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{goal.name}</h5>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${goal.saved.toLocaleString()} / ${goal.target.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className="h-2"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgressSummary;
