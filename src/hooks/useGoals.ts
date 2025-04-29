
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { toast } from "@/components/ui/use-toast";

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  createdAt: number;
}

interface GoalFormData {
  name: string;
  target: string;
  initialSaved: string;
  deadline: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [deletedGoalName, setDeletedGoalName] = useState<string | null>(null);
  const [formData, setFormData] = useState<GoalFormData>({
    name: "",
    target: "",
    initialSaved: "0",
    deadline: "",
  });

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem("financialGoals");
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setGoals(parsedGoals);
      } catch (error) {
        console.error("Failed to parse saved goals:", error);
      }
    }
  }, []);

  // Save goals to localStorage when they change
  useEffect(() => {
    localStorage.setItem("financialGoals", JSON.stringify(goals));
  }, [goals]);

  // Check for milestone achievements
  useEffect(() => {
    goals.forEach(goal => {
      const progress = getProgress(goal);
      
      // Only show milestone notifications for newly reached milestones
      if (progress >= 25 && progress < 50) {
        showMilestoneToast(goal.name, 25);
      } else if (progress >= 50 && progress < 75) {
        showMilestoneToast(goal.name, 50);
      } else if (progress >= 75 && progress < 100) {
        showMilestoneToast(goal.name, 75);
      } else if (progress >= 100) {
        showMilestoneToast(goal.name, 100);
      }
    });
  }, [goals]);

  const showMilestoneToast = (goalName: string, milestone: number) => {
    const key = `${goalName}-${milestone}`;
    const toastShown = localStorage.getItem(key);
    
    if (!toastShown) {
      let message = "";
      let title = "";
      
      switch (milestone) {
        case 25:
          title = "25% Milestone Reached!";
          message = `You're making progress on "${goalName}"! Keep it up.`;
          break;
        case 50:
          title = "Halfway There!";
          message = `You've reached 50% of your "${goalName}" goal! Great job.`;
          break;
        case 75:
          title = "Almost There!";
          message = `75% complete on "${goalName}"! The finish line is in sight.`;
          break;
        case 100:
          title = "Goal Achieved! 🎉";
          message = `Congratulations! You've completed your "${goalName}" goal!`;
          break;
      }
      
      toast({
        title,
        description: message,
      });
      
      localStorage.setItem(key, "true");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal name",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.target || parseFloat(formData.target) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid target amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.deadline) {
      toast({
        title: "Error",
        description: "Please select a deadline",
        variant: "destructive",
      });
      return;
    }

    // Create the new goal
    const newGoal: Goal = {
      id: uuid(),
      name: formData.name,
      target: parseFloat(formData.target),
      saved: parseFloat(formData.initialSaved) || 0,
      deadline: formData.deadline,
      createdAt: Date.now(),
    };
    
    setGoals(prev => [...prev, newGoal]);
    
    // Reset form
    setFormData({
      name: "",
      target: "",
      initialSaved: "0",
      deadline: "",
    });
    
    toast({
      title: "Goal Created",
      description: `Your goal "${newGoal.name}" has been created successfully.`,
    });
  };

  const handleAddSavings = (goalId: string, amount?: number) => {
    // If amount is not provided, prompt the user for an amount
    let savingsAmount = amount;
    
    if (savingsAmount === undefined) {
      const inputAmount = prompt("Enter amount to add:");
      if (inputAmount === null) return; // User canceled
      
      savingsAmount = parseFloat(inputAmount);
    }
    
    if (isNaN(savingsAmount as number) || (savingsAmount as number) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }

    setGoals(prev =>
      prev.map(g => {
        if (g.id === goalId) {
          const newSaved = g.saved + (savingsAmount as number);
          const wasComplete = g.saved >= g.target;
          const isNowComplete = newSaved >= g.target;
          
          // Only show toast if reaching 100% for the first time
          if (!wasComplete && isNowComplete) {
            toast({
              title: "Goal Achieved! 🎉",
              description: `Congratulations! You've completed your "${g.name}" goal!`,
            });
          }
          
          return { ...g, saved: newSaved };
        }
        return g;
      })
    );
    
    toast({
      title: "Savings Added",
      description: `$${savingsAmount?.toFixed(2)} has been added to your goal.`,
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    const goalToDelete = goals.find(g => g.id === goalId);
    if (!goalToDelete) return;
    
    setDeletedGoalName(goalToDelete.name);
    
    setGoals(prev => prev.filter(g => g.id !== goalId));
    
    toast({
      title: "Goal Removed",
      description: `Your goal "${goalToDelete.name}" has been deleted.`,
    });
    
    // Clear milestone toast flags for this goal
    [25, 50, 75, 100].forEach(milestone => {
      localStorage.removeItem(`${goalToDelete.name}-${milestone}`);
    });
  };

  const getProgress = (goal: Goal): number => {
    return Math.min((goal.saved / goal.target) * 100, 100);
  };

  const daysLeft = (deadline: string): string | number => {
    const now = new Date();
    const end = new Date(deadline);
    
    // Reset hours to compare just the dates
    now.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) {
      return `Overdue by ${Math.abs(diff)} day${Math.abs(diff) !== 1 ? 's' : ''}`;
    }
    
    if (diff === 0) {
      return "Due today";
    }
    
    return diff;
  };

  // Array of motivational tips
  const motivationalTips = [
    "Small savings add up to big dreams.",
    "Every dollar you save brings you one step closer to your goal.",
    "Financial freedom begins with a single savings goal.",
    "The best time to start saving was yesterday. The next best time is now.",
    "Don't save what is left after spending; spend what is left after saving.",
    "Consistency beats intensity when it comes to savings goals.",
    "Your future self thanks you for every saving today.",
    "Financial success is a marathon, not a sprint.",
    "Goals are dreams with deadlines and action plans.",
    "The habit of saving is itself an education.",
  ];

  const getRandomMotivationalTip = (): string => {
    return motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
  };

  return {
    goals,
    formData,
    handleFormChange,
    handleAddGoal,
    handleAddSavings,
    handleDeleteGoal,
    getProgress,
    daysLeft,
    getRandomMotivationalTip,
    deletedGoalName,
    setDeletedGoalName,
  };
};
