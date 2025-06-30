
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { goalService } from '@/services/supabase/goals';
import { supabase } from '@/integrations/supabase/client';
import { FinancialGoal, FinancialGoalInsert, FinancialGoalUpdate } from '@/types/database';

export const useGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [user]);

  const addGoal = async (goalData: Omit<FinancialGoalInsert, 'user_id'>) => {
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
  };

  const updateGoal = async (id: string, updates: FinancialGoalUpdate) => {
    try {
      const result = await goalService.update(id, updates);

      if (result.success) {
        toast({
          title: "Success",
          description: "Goal updated successfully",
        });
        // Update local state immediately
        setGoals(prev => prev.map(goal => 
          goal.id === id ? { ...goal, ...updates } : goal
        ));
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

  const deleteGoal = async (id: string) => {
    try {
      const result = await goalService.delete(id);

      if (result.success) {
        toast({
          title: "Success",
          description: "Goal deleted successfully",
        });
        // Update local state immediately
        setGoals(prev => prev.filter(goal => goal.id !== id));
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
  }, [fetchGoals]);

  // Simple real-time subscription
  useEffect(() => {
    if (!user) return;

    let channel: any = null;

    const setupChannel = () => {
      try {
        channel = supabase
          .channel(`goals_realtime_${user.id}_${Date.now()}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'financial_goals',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              console.log('[useGoals] Real-time update:', payload.eventType);
              
              setGoals(currentGoals => {
                switch (payload.eventType) {
                  case 'INSERT':
                    const newGoal = payload.new as FinancialGoal;
                    if (currentGoals.some(g => g.id === newGoal.id)) return currentGoals;
                    return [newGoal, ...currentGoals];
                  case 'UPDATE':
                    const updatedGoal = payload.new as FinancialGoal;
                    return currentGoals.map(goal => 
                      goal.id === updatedGoal.id ? updatedGoal : goal
                    );
                  case 'DELETE':
                    const deletedGoal = payload.old as FinancialGoal;
                    return currentGoals.filter(goal => goal.id !== deletedGoal.id);
                  default:
                    return currentGoals;
                }
              });
            }
          )
          .subscribe((status) => {
            console.log('[useGoals] Subscription status:', status);
          });
      } catch (error) {
        console.error('[useGoals] Subscription error:', error);
      }
    };

    setupChannel();

    return () => {
      if (channel) {
        console.log('[useGoals] Cleaning up channel');
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id]);

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
