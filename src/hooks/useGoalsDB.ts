
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getGoals, 
  createGoal, 
  updateGoal, 
  deleteGoal, 
  addSavingsToGoal,
  FinancialGoal 
} from "@/services/financialDatabase";

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  createdAt: number;
  type: string;
}

interface GoalFormData {
  name: string;
  target: string;
  initialSaved: string;
  deadline: string;
  type: string;
}

export const useGoalsDB = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletedGoalName, setDeletedGoalName] = useState<string | null>(null);
  const [goalTypeFilter, setGoalTypeFilter] = useState<string>("all");
  const [formData, setFormData] = useState<GoalFormData>({
    name: "",
    target: "",
    initialSaved: "0",
    deadline: "",
    type: "short-term",
  });

  // Load goals from database
  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const { data, error } = await getGoals();
      if (error) {
        console.error('Error loading goals:', error);
        toast({
          title: "Error",
          description: "Failed to load goals",
          variant: "destructive",
        });
      } else {
        const formattedGoals = (data || []).map((goal: FinancialGoal) => ({
          id: goal.id,
          name: goal.name,
          target: parseFloat(goal.target_amount.toString()),
          saved: parseFloat(goal.saved_amount.toString()),
          deadline: goal.deadline,
          createdAt: new Date(goal.created_at).getTime(),
          type: goal.goal_type
        }));
        setGoals(formattedGoals);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddGoal = async (e: React.FormEvent) => {
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
    
    if (!formData.type) {
      toast({
        title: "Error",
        description: "Please select a goal type",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await createGoal({
        name: formData.name,
        target_amount: parseFloat(formData.target),
        saved_amount: parseFloat(formData.initialSaved) || 0,
        deadline: formData.deadline,
        goal_type: formData.type as 'short-term' | 'medium-term' | 'long-term'
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create goal",
          variant: "destructive",
        });
        return;
      }

      const newGoal: Goal = {
        id: data.id,
        name: data.name,
        target: parseFloat(data.target_amount.toString()),
        saved: parseFloat(data.saved_amount.toString()),
        deadline: data.deadline,
        createdAt: new Date(data.created_at).getTime(),
        type: data.goal_type
      };
      
      setGoals(prev => [...prev, newGoal]);
      
      // Reset form
      setFormData({
        name: "",
        target: "",
        initialSaved: "0",
        deadline: "",
        type: "short-term",
      });
      
      toast({
        title: "Goal Created",
        description: `Your ${formData.type} goal "${newGoal.name}" has been created successfully.`,
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    }
  };

  const handleAddSavings = async (goalId: string, amount?: number) => {
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

    try {
      const { data, error } = await addSavingsToGoal(goalId, savingsAmount as number);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to add savings",
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
    } catch (error) {
      console.error('Error adding savings:', error);
      toast({
        title: "Error",
        description: "Failed to add savings",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const goalToDelete = goals.find(g => g.id === goalId);
    if (!goalToDelete) return;
    
    try {
      const { error } = await deleteGoal(goalId);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete goal",
          variant: "destructive",
        });
        return;
      }

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
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    }
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
  
  const getFilteredGoals = () => {
    if (goalTypeFilter === "all") {
      return goals;
    }
    
    return goals.filter(goal => goal.type === goalTypeFilter);
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
    loading,
    handleFormChange,
    handleAddGoal,
    handleAddSavings,
    handleDeleteGoal,
    getProgress,
    daysLeft,
    getRandomMotivationalTip,
    deletedGoalName,
    setDeletedGoalName,
    goalTypeFilter,
    setGoalTypeFilter,
    getFilteredGoals,
    loadGoals
  };
};
