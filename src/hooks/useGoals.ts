
/**
 * Optimized Goals Hook
 * 
 * Provides goal management with:
 * - Real-time updates with proper subscription handling
 * - Error recovery and retry logic
 * - Performance optimizations
 * - Proper loading states
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { goalService } from '@/services/supabase/goals';
import { FinancialGoal, FinancialGoalInsert, FinancialGoalUpdate } from '@/types/database';
import { useRealtime } from './useRealtime';
import { useErrorRecovery } from './useErrorRecovery';

export const useGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeWithRetry } = useErrorRecovery();
  
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch goals with error recovery
   */
  const fetchGoals = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await executeWithRetry(
        () => goalService.getAll(user.id),
        'Loading goals'
      );

      if (result.success) {
        setGoals(result.data || []);
      } else {
        setError(result.error || 'Failed to load goals');
        toast({
          title: "Error",
          description: "Failed to load goals",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add new goal with optimistic updates
   */
  const addGoal = async (goalData: Omit<FinancialGoalInsert, 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const result = await executeWithRetry(
        () => goalService.create({
          ...goalData,
          user_id: user.id
        }),
        'Adding goal'
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Goal added successfully",
        });
        // Real-time will handle the state update
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add goal",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add goal';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Update goal with optimistic updates
   */
  const updateGoal = async (id: string, updates: FinancialGoalUpdate) => {
    try {
      const result = await executeWithRetry(
        () => goalService.update(id, updates),
        'Updating goal'
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Goal updated successfully",
        });
        // Real-time will handle the state update
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update goal",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update goal';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Delete goal with optimistic updates
   */
  const deleteGoal = async (id: string) => {
    try {
      const result = await executeWithRetry(
        () => goalService.delete(id),
        'Deleting goal'
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Goal deleted successfully",
        });
        // Real-time will handle the state update
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete goal",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchGoals();
  }, [user]);

  // Setup real-time updates with optimized subscription
  useRealtime<FinancialGoal>(
    "financial_goals", 
    user?.id || null, 
    setGoals,
    {
      enableDebounce: true,
      debounceMs: 200,
      enableRetry: true,
      maxRetries: 3
    }
  );

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
};
