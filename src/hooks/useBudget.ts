
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { budgetService } from "@/services/budgetService";
import { budgetSchema, validateData } from "@/utils/validation";
import { useErrorHandler } from "./useErrorHandler";

export const useBudget = () => {
  const { toast } = useToast();
  const { handleError, handleSuccess } = useErrorHandler();
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
      const { data, error } = await budgetService.getCurrentBudget();
      if (error) {
        handleError(error, "loading budget");
      } else if (data) {
        setBudgetLimit(parseFloat(data.monthly_limit.toString()));
        setCurrentSpent(parseFloat(data.current_spent.toString()));
      }
    } catch (err) {
      handleError(err, "loading budget");
    } finally {
      setLoading(false);
    }
  };

  const updateBudgetLimit = async (newLimit: number) => {
    const currentDate = new Date();
    
    // Validate budget data
    const validation = validateData(budgetSchema, {
      monthly_limit: newLimit,
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    });

    if (!validation.success) {
      validation.errors.forEach(error => {
        toast({
          title: "Validation Error",
          description: error,
          variant: "destructive",
        });
      });
      return false;
    }

    try {
      const { error } = await budgetService.createOrUpdateBudget({
        monthly_limit: validation.data.monthly_limit,
        current_spent: currentSpent,
        month: validation.data.month,
        year: validation.data.year
      });

      if (error) {
        handleError(error, "updating budget limit");
        return false;
      }

      setBudgetLimit(validation.data.monthly_limit);
      handleSuccess("Budget limit updated successfully");
      return true;
    } catch (err) {
      handleError(err, "updating budget limit");
      return false;
    }
  };

  const updateSpent = async (newSpent: number) => {
    try {
      const { error } = await budgetService.updateBudgetSpent(newSpent);
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
  const percentUsed = budgetLimit > 0 ? (currentSpent / budgetLimit) * 100 : 0;

  // Budget alerts
  useEffect(() => {
    if (loading || !user) return; // Don't show alerts while loading or not authenticated
    
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
  }, [overBudget, closeToLimit, loading, user, toast]);

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
