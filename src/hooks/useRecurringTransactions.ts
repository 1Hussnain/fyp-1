
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface RecurringTransaction {
  id: string;
  category_id: string | null;
  amount: number;
  type: "income" | "expense";
  frequency: "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate?: string;
  lastProcessed?: string;
  active: boolean;
  description?: string;
  categoryName?: string; // Add this for display purposes
}

export const useRecurringTransactions = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recurringTransactions');
    if (stored) {
      setRecurringTransactions(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
  }, [recurringTransactions]);

  const addRecurringTransaction = (transaction: Omit<RecurringTransaction, 'id' | 'active' | 'lastProcessed'>) => {
    const newTransaction: RecurringTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      active: true
    };

    setRecurringTransactions(prev => [...prev, newTransaction]);
    
    toast({
      title: "Recurring Transaction Added",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} will be processed ${transaction.frequency}.`,
    });

    return newTransaction.id;
  };

  const toggleRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, active: !transaction.active } : transaction
      )
    );
  };

  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast({
      title: "Recurring Transaction Deleted",
      description: "The recurring transaction has been removed.",
    });
  };

  const processRecurringTransactions = async () => {
    const today = new Date();
    const processedTransactions: string[] = [];

    for (const recurring of recurringTransactions) {
      if (!recurring.active) continue;

      const shouldProcess = shouldProcessRecurring(recurring, today);
      
      if (shouldProcess) {
        try {
          const { error } = await supabase
            .from('transactions')
            .insert({
              user_id: user?.id,
              type: recurring.type,
              category_id: recurring.category_id,
              amount: recurring.amount,
              description: recurring.description || `Recurring ${recurring.frequency} transaction`,
              date: today.toISOString().split('T')[0]
            });

          if (error) throw error;

          processedTransactions.push(recurring.description || recurring.type);
          
          // Update last processed date
          setRecurringTransactions(prev =>
            prev.map(t =>
              t.id === recurring.id 
                ? { ...t, lastProcessed: today.toISOString() }
                : t
            )
          );
        } catch (error) {
          console.error('Error processing recurring transaction:', error);
        }
      }
    }

    if (processedTransactions.length > 0) {
      toast({
        title: "Recurring Transactions Processed",
        description: `Processed ${processedTransactions.length} recurring transactions: ${processedTransactions.join(', ')}`,
      });
    }

    return processedTransactions;
  };

  const shouldProcessRecurring = (recurring: RecurringTransaction, today: Date): boolean => {
    if (!recurring.lastProcessed) return true;

    const lastProcessed = new Date(recurring.lastProcessed);
    const daysSinceProcessed = Math.floor((today.getTime() - lastProcessed.getTime()) / (1000 * 60 * 60 * 24));

    switch (recurring.frequency) {
      case 'weekly':
        return daysSinceProcessed >= 7;
      case 'monthly':
        return daysSinceProcessed >= 30;
      case 'yearly':
        return daysSinceProcessed >= 365;
      default:
        return false;
    }
  };

  return {
    recurringTransactions,
    addRecurringTransaction,
    toggleRecurringTransaction,
    deleteRecurringTransaction,
    processRecurringTransactions
  };
};
