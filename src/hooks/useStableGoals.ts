
/**
 * Stable Goals Hook
 * 
 * Replaces the complex useSimpleGoals with a more stable version
 * that avoids dependency issues and provides better error handling.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { goalService } from '@/services/supabase/goals';
import { FinancialGoal, FinancialGoalInsert, FinancialGoalUpdate } from '@/types/database';
import { useSimpleRealtime } from './useSimpleRealtime';

export const useStableGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to prevent infinite re-renders
  const hasFetchedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  // Stable fetch function
  const fetchGoals = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // Prevent duplicate fetches for same user
    if (hasFetchedRef.current && userIdRef.current === user.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('[useStableGoals] Fetching goals for user:', user.id);

      const result = await goalService.getAll(user.id);

      if (result.success) {
        setGoals(result.data || []);
        hasFetchedRef.current = true;
        userIdRef.current = user.id;
        console.log('[useStableGoals] Successfully loaded', result.data?.length || 0, 'goals');
      } else {
        setError(result.error || 'Failed to load goals');
        console.error('[useStableGoals] Error loading goals:', result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('[useStableGoals] Exception loading goals:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Handle real-time updates with stable callback
  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log('[useStableGoals] Realtime update:', payload.eventType);
    
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setGoals(currentGoals => {
      switch (eventType) {
        case 'INSERT':
          // Avoid duplicates
          if (currentGoals.some(goal => goal.id === newRecord.id)) {
            return currentGoals;
          }
          return [...currentGoals, newRecord];
          
        case 'UPDATE':
          return currentGoals.map(goal => 
            goal.id === newRecord.id ? newRecord : goal
          );
          
        case 'DELETE':
          return currentGoals.filter(goal => goal.id !== oldRecord.id);
          
        default:
          return currentGoals;
      }
    });
  }, []);

  // Set up real-time subscription with stable callback
  useSimpleRealtime('financial_goals', user?.id || null, handleRealtimeUpdate);

  // Reset state when user changes
  useEffect(() => {
    if (userIdRef.current !== user?.id) {
      console.log('[useStableGoals] User changed, resetting state');
      hasFetchedRef.current = false;
      userIdRef.current = user?.id || null;
      setGoals([]);
      setError(null);
      setLoading(true);
    }
  }, [user?.id]);

  // Initial data fetch
  useEffect(() => {
    if (user?.id && !hasFetchedRef.current) {
      fetchGoals();
    }
  }, [user?.id, fetchGoals]);

  // CRUD operations with better error handling
  const addGoal = async (goalData: Omit<FinancialGoalInsert, 'user_id'>) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add goals",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

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
