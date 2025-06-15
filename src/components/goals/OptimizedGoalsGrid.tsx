
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import OptimizedGoalCard from "./OptimizedGoalCard";

interface OptimizedGoalsGridProps {
  goals: any[];
  onUpdateGoal: (id: string, updates: any) => void;
  onDeleteGoal: (id: string) => void;
  emptyMessage: string;
  emptyDescription: string;
  showActions?: boolean;
}

const OptimizedGoalsGrid: React.FC<OptimizedGoalsGridProps> = ({
  goals,
  onUpdateGoal,
  onDeleteGoal,
  emptyMessage,
  emptyDescription,
  showActions = true
}) => {
  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">{emptyMessage}</p>
          <p className="text-sm text-gray-400">
            {emptyDescription}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <OptimizedGoalCard 
          key={goal.id} 
          goal={goal} 
          onUpdateGoal={onUpdateGoal}
          onDeleteGoal={onDeleteGoal}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default OptimizedGoalsGrid;
