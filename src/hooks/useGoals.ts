
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtime } from './useRealtime';
import { supabase } from '@/integrations/supabase/client';
import { FinancialGoal } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

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
      console.log('[useGoals] Fetching goals for user:', user.id);
      
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGoals(data || []);
      setError(null);
      console.log('[useGoals] Successfully loaded', data?.length || 0, 'goals');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load goals';
      console.error('[useGoals] Error fetching goals:', err);
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log('[useGoals] Realtime update:', payload);
    
    if (payload.eventType === 'INSERT') {
      setGoals(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setGoals(prev => prev.map(goal => 
        goal.id === payload.new.id ? payload.new : goal
      ));
    } else if (payload.eventType === 'DELETE') {
      setGoals(prev => prev.filter(goal => goal.id !== payload.old.id));
    }
  }, []);

  const updateGoal = async (id: string, updates: Partial<FinancialGoal>) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal updated successfully",
      });
    } catch (err) {
      console.error('[useGoals] Error updating goal:', err);
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      });
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
    } catch (err) {
      console.error('[useGoals] Error deleting goal:', err);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  useRealtime('financial_goals', user?.id || null, handleRealtimeUpdate);

  return {
    goals,
    loading,
    error,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
};
