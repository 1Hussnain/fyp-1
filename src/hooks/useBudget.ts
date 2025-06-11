
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getCurrentBudget, 
  createOrUpdateBudget,
  updateBudgetSpent
} from "@/services/financialDatabase";

export const useBudget = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [budgetLimit, setBudgetLimit] = useState(100000);
  const [currentSpent, setCurrentSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load budget from database
  useEffect(() => {
    if (user) {
      loadBudget();
    }
  }, [user]);

  const loadBudget = async () => {
    setLoading(true);
    try {
      const { data, error } = await getCurrentBudget();
      if (error) {
        console.error('Error loading budget:', error);
      } else if (data) {
        setBudgetLimit(parseFloat(data.monthly_limit.toString()));
        setCurrentSpent(parseFloat(data.current_spent.toString()));
      }
    } catch (err) {
      console.error("Error loading budget:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateBudgetLimit = async (newLimit: number) => {
    if (isNaN(newLimit) || newLimit < 0) {
      toast({
        title: "Error",
        description: "Budget limit must be a valid positive number",
        variant: "destructive",
      });
      return false;
    }

    try {
      const currentDate = new Date();
      const { error } = await createOrUpdateBudget({
        monthly_limit: newLimit,
        current_spent: currentSpent,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update budget limit",
          variant: "destructive",
        });
        return false;
      }

      setBudgetLimit(newLimit);
      toast({
        title: "Success",
        description: "Budget limit updated successfully",
      });
      return true;
    } catch (err) {
      console.error("Error updating budget limit:", err);
      toast({
        title: "Error",
        description: "Failed to update budget limit",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSpent = async (newSpent: number) => {
    try {
      const { error } = await updateBudgetSpent(newSpent);
      if (error) {
        console.error("Error updating budget spent:", error);
      } else {
        setCurrentSpent(newSpent);
      }
    } catch (err) {
      console.error("Error updating budget spent:", err);
    }
  };

  // Budget status calculations
  const remaining = budgetLimit - currentSpent;
  const overBudget = currentSpent > budgetLimit;
  const closeToLimit = currentSpent > budgetLimit * 0.9 && !overBudget;
  const percentUsed = (currentSpent / budgetLimit) * 100;

  // Budget alerts
  useEffect(() => {
    if (overBudget) {
      toast({
        title: "Budget Alert",
        description: "⚠️ You've exceeded your monthly budget limit!",
        variant: "destructive",
      });
    } else if (closeToLimit) {
      toast({
        title: "Budget Warning",
        description: "Heads up! You're very close to your monthly budget limit.",
        variant: "default",
      });
    }
  }, [overBudget, closeToLimit, toast]);

  return {
    budgetLimit,
    currentSpent,
    remaining,
    overBudget,
    closeToLimit,
    percentUsed,
    loading,
    updateBudgetLimit,
    updateSpent,
    loadBudget
  };
};
