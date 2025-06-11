
import { supabase } from "@/integrations/supabase/client";

export const budgetService = {
  async getCurrentBudget() {
    const currentDate = new Date();
    return await supabase
      .from('budgets')
      .select('*')
      .eq('month', currentDate.getMonth() + 1)
      .eq('year', currentDate.getFullYear())
      .single();
  },

  async createOrUpdateBudget(budget: {
    monthly_limit: number;
    current_spent: number;
    month: number;
    year: number;
  }) {
    const user = await supabase.auth.getUser();
    return await supabase
      .from('budgets')
      .upsert([{
        user_id: user.data.user?.id,
        ...budget
      }])
      .select()
      .single();
  },

  async updateBudgetSpent(amount: number) {
    const currentDate = new Date();
    const user = await supabase.auth.getUser();
    return await supabase
      .from('budgets')
      .update({ current_spent: amount })
      .eq('user_id', user.data.user?.id)
      .eq('month', currentDate.getMonth() + 1)
      .eq('year', currentDate.getFullYear());
  }
};
