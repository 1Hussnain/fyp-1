
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Budget } from "@/types/database";
import { useRealtime } from './useRealtime';

export const useBudget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [budgetLimit, setBudgetLimit] = useState<number>(0);
  const [currentSpent, setCurrentSpent] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    if (user) {
      fetchCurrentBudget();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCurrentBudget = async () => {
    try {
      const currentDate = new Date();
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user?.id)
        .eq('month', currentDate.getMonth() + 1)
        .eq('year', currentDate.getFullYear());

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching budget:', error);
        return;
      }

      // Always treat as array
      const budgetsArray = Array.isArray(data) ? data : (data ? [data] : []);
      setBudgets(budgetsArray);
      if (budgetsArray.length > 0) {
        setBudgetLimit(Number(budgetsArray[0].monthly_limit || 0));
        setCurrentSpent(Number(budgetsArray[0].current_spent || 0));
      } else {
        setBudgetLimit(0);
        setCurrentSpent(0);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBudgetLimit = async (newLimit: number) => {
    try {
      const currentDate = new Date();
      const { error } = await supabase
        .from('budgets')
        .upsert({
          user_id: user?.id,
          monthly_limit: newLimit,
          current_spent: currentSpent,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setBudgetLimit(newLimit);
      toast({
        title: "Budget Updated",
        description: `Budget limit set to $${newLimit}`,
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget limit",
        variant: "destructive",
      });
    }
  };

  const updateSpent = async (newSpent: number) => {
    try {
      const currentDate = new Date();
      const { error } = await supabase
        .from('budgets')
        .upsert({
          user_id: user?.id,
          monthly_limit: budgetLimit,
          current_spent: newSpent,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setCurrentSpent(newSpent);
    } catch (error) {
      console.error('Error updating spent amount:', error);
    }
  };

  // Add realtime updates for budgets
  useRealtime<Budget>("budgets", user?.id || null, (allBudgets: Budget[]) => {
    // Only update state if this month/year, as budgetLimit and currentSpent show this month's values
    const currentDate = new Date();
    const filtered = allBudgets.filter(
      (b) =>
        b.month === currentDate.getMonth() + 1 &&
        b.year === currentDate.getFullYear()
    );
    setBudgets(filtered);
    if (filtered.length) {
      setBudgetLimit(Number(filtered[0].monthly_limit || 0));
      setCurrentSpent(Number(filtered[0].current_spent || 0));
    } else {
      setBudgetLimit(0);
      setCurrentSpent(0);
    }
  });

  const remaining = budgetLimit - currentSpent;
  const overBudget = currentSpent > budgetLimit;

  return {
    budgetLimit,
    currentSpent,
    remaining,
    overBudget,
    loading,
    updateBudgetLimit,
    updateSpent
  };
};
