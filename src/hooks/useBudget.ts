
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBudget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [budgetLimit, setBudgetLimit] = useState<number>(0);
  const [currentSpent, setCurrentSpent] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCurrentBudget();
    }
  }, [user]);

  const fetchCurrentBudget = async () => {
    try {
      const currentDate = new Date();
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', currentDate.getMonth() + 1)
        .eq('year', currentDate.getFullYear())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching budget:', error);
        return;
      }

      if (data) {
        setBudgetLimit(Number(data.monthly_limit || 0));
        setCurrentSpent(Number(data.current_spent || 0));
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

  return {
    budgetLimit,
    currentSpent,
    loading,
    updateBudgetLimit,
    updateSpent
  };
};
