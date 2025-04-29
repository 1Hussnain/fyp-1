
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@/hooks/useGoals";
import { 
  Award, Calendar, Trash, PlusCircle, Target, Circle, Tag, Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GoalCardProps {
  goal: Goal;
  progress: number;
  daysLeft: string | number;
  onAddSavings: (goalId: string, amount?: number) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  progress,
  daysLeft,
  onAddSavings,
  onDeleteGoal
}) => {
  const [quickAmount, setQuickAmount] = useState<number | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  const quickAddAmounts = [10, 50, 100, 500];
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  const renderProgressColor = (progress: number) => {
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-orange-500";
    if (progress < 75) return "bg-yellow-500";
    if (progress < 100) return "bg-blue-500";
    return "bg-green-500";
  };
  
  const isOverdue = typeof daysLeft === 'string' && daysLeft.includes('Overdue');
  const isCompleted = progress >= 100;
  
  // Determine card style based on status
  const getCardStyle = () => {
    if (isCompleted) return "border-green-200 bg-green-50";
    if (isOverdue) return "border-red-200 bg-red-50";
    return "border-gray-200 bg-white";
  };
  
  const renderBadge = (progress: number) => {
    if (progress >= 100) {
      return (
        <div className="flex items-center text-green-700 font-medium">
          <Award className="h-4 w-4 mr-1" />
          <span>Goal Achieved!</span>
        </div>
      );
    }
    
    if (progress >= 75) {
      return (
        <div className="flex items-center text-blue-700 font-medium">
          <Target className="h-4 w-4 mr-1" />
          <span>Almost there!</span>
        </div>
      );
    }
    
    if (progress >= 50) {
      return (
        <div className="flex items-center text-yellow-700 font-medium">
          <Circle className="h-4 w-4 mr-1" />
          <span>Halfway Done!</span>
        </div>
      );
    }
    
    if (progress >= 25) {
      return (
        <div className="flex items-center text-orange-700 font-medium">
          <Circle className="h-4 w-4 mr-1" />
          <span>Keep Going!</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-gray-600">
        <Circle className="h-4 w-4 mr-1" />
        <span>Just Started</span>
      </div>
    );
  };
  
  const renderMotivation = (progress: number, daysLeft: string | number) => {
    if (typeof daysLeft === "string" && daysLeft.includes("Overdue")) {
      return (
        <p className="text-red-500 text-sm font-medium">
          ⚠️ You're past the deadline. Adjust or reset your goal.
        </p>
      );
    }
    
    if (progress >= 100) {
      return (
        <p className="text-green-700 text-sm">
          🎉 Congratulations on achieving your goal!
        </p>
      );
    }
    
    if (progress < 25) {
      return (
        <p className="text-sm text-gray-600">
          Start small, every dollar counts 💰
        </p>
      );
    }
    
    if (progress >= 50 && typeof daysLeft === "number" && daysLeft > 10) {
      return (
        <p className="text-sm text-green-700">
          Great pace! You're on track 🚀
        </p>
      );
    }
    
    if (progress >= 75 && typeof daysLeft === "number" && daysLeft < 10) {
      return (
        <p className="text-sm text-yellow-700">
          Almost done! Just a final push! 💪
        </p>
      );
    }
    
    return (
      <p className="text-sm text-blue-600">
        You're making steady progress! Keep it up ✨
      </p>
    );
  };
  
  return (
    <motion.div variants={item}>
      <Card className={`p-5 shadow-md h-full flex flex-col ${getCardStyle()}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-800">{goal.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDeleteGoal(goal.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-3 text-sm text-gray-600 flex flex-col gap-1">
          <div className="flex justify-between">
            <span>Target: ${goal.target.toFixed(2)}</span>
            <span>Saved: ${goal.saved.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" />
            <span>Type: {goal.type || "Short-term"}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Deadline: {formatDate(goal.deadline)}</span>
          </div>
          
          <div className="text-xs text-gray-500">
            Created {formatDistanceToNow(goal.createdAt)} ago
          </div>
        </div>
        
        <div className="mt-1 mb-3">
          <Progress 
            value={progress} 
            className={`h-2.5`}
          />
          <div className="flex justify-between text-xs mt-1">
            <span className="font-medium">{Math.floor(progress)}%</span>
            <span className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
              {typeof daysLeft === "number" 
                ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` 
                : daysLeft}
            </span>
          </div>
        </div>
        
        <div className="my-2">
          {renderBadge(progress)}
        </div>
        
        <div className="my-2 min-h-[2rem] text-sm">
          {renderMotivation(progress, daysLeft)}
        </div>
        
        <div className="mt-auto pt-3">
          {!isCompleted && showQuickAdd ? (
            <div className="grid grid-cols-2 gap-2">
              {quickAddAmounts.map(amount => (
                <Button 
                  key={amount}
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    onAddSavings(goal.id, amount);
                    setShowQuickAdd(false);
                  }}
                >
                  + ${amount}
                </Button>
              ))}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs col-span-2"
                onClick={() => {
                  onAddSavings(goal.id);
                  setShowQuickAdd(false);
                }}
              >
                Custom Amount...
              </Button>
            </div>
          ) : (
            <Button 
              variant="default"
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowQuickAdd(true)}
              disabled={progress >= 100}
            >
              {isCompleted ? (
                <>
                  <Award className="h-4 w-4 mr-1" />
                  Goal Achieved
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Savings
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default GoalCard;
