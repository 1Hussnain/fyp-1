
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { goalService } from '@/services/supabase';
import { FinancialGoal, FinancialGoalInsert, FinancialGoalUpdate } from '@/types/database';
import { useRealtime } from './useRealtime';

export const useGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    if (!user) return;

    setLoading(true);
    const result = await goalService.getAll(user.id);

    if (result.success) {
      setGoals(result.data || []);
    } else {
      toast({
        title: "Error",
        description: "Failed to load goals",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const addGoal = async (goalData: Omit<FinancialGoalInsert, 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

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
  };

  const updateGoal = async (id: string, updates: FinancialGoalUpdate) => {
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
  };

  const deleteGoal = async (id: string) => {
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
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  // Add realtime updates
  useRealtime<FinancialGoal>("financial_goals", user?.id || null, setGoals);

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
};
