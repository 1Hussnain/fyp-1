
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  category: string;
  source: string | null;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface FormattedTransaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

export const transactionService = {
  async getTransactions() {
    return await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
  },

  async createTransaction(transaction: {
    type: string;
    category: string;
    source: string | null;
    amount: number;
    description: string | null;
    date: string;
  }) {
    return await supabase
      .from('transactions')
      .insert([{
        user_id: (await supabase.auth.getUser()).data.user?.id,
        ...transaction
      }])
      .select()
      .single();
  },

  async updateTransaction(id: string, updates: {
    category?: string;
    amount?: number;
    type?: string;
  }) {
    return await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  async deleteTransaction(id: string) {
    return await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
  },

  formatTransaction(transaction: Transaction): FormattedTransaction {
    return {
      id: transaction.id,
      category: transaction.category,
      amount: parseFloat(transaction.amount.toString()),
      type: transaction.type as "income" | "expense",
      date: new Date(transaction.date).toLocaleDateString()
    };
  }
};
