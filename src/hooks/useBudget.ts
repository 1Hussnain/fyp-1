
/**
 * Optimized Budget Hook
 * 
 * Provides budget management with:
 * - Real-time updates with proper subscription handling
 * - Error recovery and retry logic
 * - Performance optimizations
 * - Proper loading states
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Budget } from "@/types/database";
import { useErrorRecovery } from './useErrorRecovery';

export const useBudget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeWithRetry } = useErrorRecovery();
  
  const [budgetLimit, setBudgetLimit] = useState<number>(0);
  const [currentSpent, setCurrentSpent] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch current budget with error recovery
   */
  const fetchCurrentBudget = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await executeWithRetry(async () => {
        const currentDate = new Date();
        const { data, error } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id)
          .eq('month', currentDate.getMonth() + 1)
          .eq('year', currentDate.getFullYear());

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        return { success: true, data: data || [] };
      }, 'Loading budget data');

      if (result.success) {
        const budgetsArray = Array.isArray(result.data) ? result.data : (result.data ? [result.data] : []);
        setBudgets(budgetsArray);
        
        if (budgetsArray.length > 0) {
          setBudgetLimit(Number(budgetsArray[0].monthly_limit || 0));
          setCurrentSpent(Number(budgetsArray[0].current_spent || 0));
        } else {
          setBudgetLimit(0);
          setCurrentSpent(0);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load budget';
      setError(errorMessage);
      console.error('Error fetching budget:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update budget limit with error recovery
   */
  const updateBudgetLimit = async (newLimit: number) => {
    if (!user) return;

    try {
      await executeWithRetry(async () => {
        const currentDate = new Date();
        const { error } = await supabase
          .from('budgets')
          .upsert({
            user_id: user.id,
            monthly_limit: newLimit,
            current_spent: currentSpent,
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        return { success: true };
      }, 'Updating budget limit');

      setBudgetLimit(newLimit);
      toast({
        title: "Budget Updated",
        description: `Budget limit set to $${newLimit}`,
      });
    } catch (err) {
      console.error('Error updating budget:', err);
      toast({
        title: "Error",
        description: "Failed to update budget limit",
        variant: "destructive",
      });
    }
  };

  /**
   * Update spent amount with error recovery
   */
  const updateSpent = async (newSpent: number) => {
    if (!user) return;

    try {
      await executeWithRetry(async () => {
        const currentDate = new Date();
        const { error } = await supabase
          .from('budgets')
          .upsert({
            user_id: user.id,
            monthly_limit: budgetLimit,
            current_spent: newSpent,
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        return { success: true };
      }, 'Updating spent amount');

      setCurrentSpent(newSpent);
    } catch (err) {
      console.error('Error updating spent amount:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCurrentBudget();
  }, [user]);

  // Real-time subscription temporarily disabled to fix crashes
  // useEffect(() => {
  //   if (!user?.id) return;
  //   console.log('[useBudget] Real-time disabled');
  // }, [user?.id]);

  const remaining = budgetLimit - currentSpent;
  const overBudget = currentSpent > budgetLimit && budgetLimit > 0;

  return {
    budgetLimit,
    currentSpent,
    remaining,
    overBudget,
    loading,
    error,
    updateBudgetLimit,
    updateSpent,
    refetch: fetchCurrentBudget
  };
};
