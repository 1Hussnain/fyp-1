
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target } from "lucide-react";
import OptimizedGoalsGrid from "./OptimizedGoalsGrid";

interface OptimizedGoalsTabsProps {
  activeGoals: any[];
  completedGoals: any[];
  onUpdateGoal: (id: string, updates: any) => void;
  onDeleteGoal: (id: string) => void;
}

const OptimizedGoalsTabs: React.FC<OptimizedGoalsTabsProps> = ({
  activeGoals,
  completedGoals,
  onUpdateGoal,
  onDeleteGoal
}) => {
  return (
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
        <OptimizedGoalsGrid
          goals={activeGoals}
          onUpdateGoal={onUpdateGoal}
          onDeleteGoal={onDeleteGoal}
          emptyMessage="No active goals yet"
          emptyDescription="Create your first financial goal to start tracking your progress"
          showActions={true}
        />
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        <OptimizedGoalsGrid
          goals={completedGoals}
          onUpdateGoal={onUpdateGoal}
          onDeleteGoal={onDeleteGoal}
          emptyMessage="No completed goals yet"
          emptyDescription="Your achieved goals will appear here"
          showActions={false}
        />
      </TabsContent>
    </Tabs>
  );
};

export default OptimizedGoalsTabs;
