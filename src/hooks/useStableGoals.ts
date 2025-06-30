
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { goalService } from '@/services/supabase/goals';
import { supabase } from '@/integrations/supabase/client';
import { FinancialGoal, FinancialGoalInsert, FinancialGoalUpdate } from '@/types/database';

export const useStableGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals with stable reference
  const fetchGoals = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await goalService.getAll(user.id);

      if (result.success) {
        setGoals(result.data || []);
      } else {
        setError(result.error || 'Failed to load goals');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Simple real-time updates without external hook to avoid conflicts
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`goals_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_goals',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          setGoals(currentGoals => {
            switch (eventType) {
              case 'INSERT':
                const newGoal = newRecord as FinancialGoal;
                return [...currentGoals, newGoal];
              case 'UPDATE':
                const updatedGoal = newRecord as FinancialGoal;
                return currentGoals.map(goal => 
                  goal.id === updatedGoal.id ? updatedGoal : goal
                );
              case 'DELETE':
                const deletedGoal = oldRecord as FinancialGoal;
                return currentGoals.filter(goal => goal.id !== deletedGoal.id);
              default:
                return currentGoals;
            }
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user?.id]);

  // CRUD operations with stable references
  const addGoal = useCallback(async (goalData: Omit<FinancialGoalInsert, 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const result = await goalService.create({
        ...goalData,
        user_id: user.id
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Goal added successfully",
        });
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
  }, [user, toast]);

  const updateGoal = useCallback(async (id: string, updates: FinancialGoalUpdate) => {
    try {
      const result = await goalService.update(id, updates);

      if (result.success) {
        toast({
          title: "Success",
          description: "Goal updated successfully",
        });
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
  }, [toast]);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      const result = await goalService.delete(id);

      if (result.success) {
        toast({
          title: "Success",
          description: "Goal deleted successfully",
        });
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
  }, [toast]);

  // Initial data fetch
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

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
