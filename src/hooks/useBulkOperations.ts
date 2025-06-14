
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BulkTransaction {
  type: 'income' | 'expense';
  category_id: string | null;
  amount: number;
  description?: string;
  date: string;
}

export const useBulkOperations = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleBulkImport = async (transactions: BulkTransaction[]) => {
    try {
      const transactionsWithUser = transactions.map(transaction => ({
        ...transaction,
        user_id: user?.id
      }));

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionsWithUser)
        .select();

      if (error) throw error;

      toast({
        title: "Bulk Import Successful",
        description: `${transactions.length} transactions imported successfully`,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error importing transactions:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import transactions",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const handleAddRecurring = async (
    transaction: BulkTransaction,
    frequency: 'weekly' | 'monthly' | 'yearly',
    occurrences: number
  ) => {
    try {
      const transactions: any[] = [];
      const startDate = new Date(transaction.date);

      for (let i = 0; i < occurrences; i++) {
        const date = new Date(startDate);
        
        switch (frequency) {
          case 'weekly':
            date.setDate(startDate.getDate() + (i * 7));
            break;
          case 'monthly':
            date.setMonth(startDate.getMonth() + i);
            break;
          case 'yearly':
            date.setFullYear(startDate.getFullYear() + i);
            break;
        }

        transactions.push({
          ...transaction,
          date: date.toISOString().split('T')[0],
          user_id: user?.id
        });
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactions)
        .select();

      if (error) throw error;

      toast({
        title: "Recurring Transactions Added",
        description: `${occurrences} recurring transactions created`,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error adding recurring transactions:', error);
      toast({
        title: "Error",
        description: "Failed to add recurring transactions",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return {
    handleBulkImport,
    handleAddRecurring
  };
};
