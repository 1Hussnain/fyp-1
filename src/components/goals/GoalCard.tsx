
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FinancialGoal } from "@/types/database";
import { Calendar, DollarSign, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoalCardProps {
  goal: FinancialGoal;
  onUpdateGoal: (id: string, updates: Partial<FinancialGoal>) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdateGoal, onDeleteGoal }) => {
  const { toast } = useToast();
  const [addAmount, setAddAmount] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const progress = Math.min((Number(goal.saved_amount) / Number(goal.target_amount)) * 100, 100);
  const isComplete = goal.is_completed || progress >= 100;

  const daysUntilDeadline = goal.deadline 
    ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleAddSavings = () => {
    if (!addAmount || isNaN(Number(addAmount)) || Number(addAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const newSavedAmount = Number(goal.saved_amount) + Number(addAmount);
    onUpdateGoal(goal.id, {
      saved_amount: newSavedAmount,
      is_completed: newSavedAmount >= Number(goal.target_amount)
    });
    
    setAddAmount("");
    setIsAdding(false);
    
    toast({
      title: "Success",
      description: `Added $${addAmount} to your goal!`,
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this goal?")) {
      onDeleteGoal(goal.id);
    }
  };

  return (
    <Card className={`relative ${isComplete ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : ''} transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {goal.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
            {goal.priority}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {goal.goal_type?.replace('_', ' ')}
          </Badge>
          {isComplete && (
            <Badge variant="default" className="bg-green-600 text-white">
              Completed!
            </Badge>
          )}
        </div>
        
        {goal.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {goal.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">
              ${Number(goal.saved_amount).toLocaleString()} of ${Number(goal.target_amount).toLocaleString()}
            </span>
          </div>
          {goal.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className={`text-xs ${daysUntilDeadline && daysUntilDeadline < 0 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
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
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm font-bold text-blue-600">{progress.toFixed(1)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-3 bg-gray-200 dark:bg-gray-700"
          />
        </div>

        {!isComplete && (
          <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            {isAdding ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddSavings}
                  className="bg-green-600 hover:bg-green-700 text-white px-3"
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setAddAmount("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button
                  size="sm"
                  onClick={() => setIsAdding(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Savings
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalCard;
