
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];

export interface TransactionWithCategory extends Transaction {
  categories: Category | null;
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
      .select(`
        *,
        categories(*)
      `)
      .order('date', { ascending: false });
  },

  async createTransaction(transaction: {
    type: string;
    category_id: string | null;
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
      .select(`
        *,
        categories(*)
      `)
      .single();
  },

  async updateTransaction(id: string, updates: {
    category_id?: string;
    amount?: number;
    type?: string;
    description?: string;
  }) {
    return await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        categories(*)
      `)
      .single();
  },

  async deleteTransaction(id: string) {
    return await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
  },

  formatTransaction(transaction: TransactionWithCategory): FormattedTransaction {
    return {
      id: transaction.id,
      category: transaction.categories?.name || 'Uncategorized',
      amount: parseFloat(transaction.amount.toString()),
      type: transaction.type as "income" | "expense",
      date: new Date(transaction.date).toLocaleDateString()
    };
  }
};
