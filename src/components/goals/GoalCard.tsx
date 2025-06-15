
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinancialGoal } from "@/types/database";
import { Calendar, DollarSign, Target } from "lucide-react";

interface GoalCardProps {
  goal: FinancialGoal;
  onUpdateGoal: (id: string, updates: Partial<FinancialGoal>) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdateGoal, onDeleteGoal }) => {
  const progress = Math.min((Number(goal.saved_amount) / Number(goal.target_amount)) * 100, 100);
  const isComplete = goal.is_completed || progress >= 100;

  const daysUntilDeadline = goal.deadline 
    ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card className={`${isComplete ? 'border-green-200 bg-green-50/50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{goal.name}</CardTitle>
          <div className="flex gap-1">
            <Badge variant={goal.priority === 'high' ? 'destructive' : 'default'}>
              {goal.priority}
            </Badge>
            <Badge variant="outline">{goal.goal_type}</Badge>
          </div>
        </div>
        {goal.description && (
          <p className="text-sm text-gray-600">{goal.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>${Number(goal.saved_amount).toFixed(2)} of ${Number(goal.target_amount).toFixed(2)}</span>
          </div>
          {goal.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className={daysUntilDeadline && daysUntilDeadline < 0 ? 'text-red-600' : ''}>
                {daysUntilDeadline !== null 
                  ? daysUntilDeadline < 0 
                    ? `${Math.abs(daysUntilDeadline)} days overdue`
                    : `${daysUntilDeadline} days left`
                  : 'No deadline'
                }
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-bold">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const amount = prompt('Enter amount to add:');
              if (amount && !isNaN(Number(amount))) {
                onUpdateGoal(goal.id, {
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
            onClick={() => onDeleteGoal(goal.id)}
            className="text-red-600"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
