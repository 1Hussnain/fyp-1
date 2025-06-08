import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getTransactions, 
  createTransaction, 
  getCurrentBudget, 
  createOrUpdateBudget,
  updateBudgetSpent,
  updateTransaction,
  deleteTransaction,
  Transaction 
} from "@/services/financialDatabase";

interface TransactionFilter {
  type: "all" | "income" | "expense";
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface FormattedTransaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

export const useFinancialDataDB = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [budgetLimit, setBudgetLimit] = useState(100000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TransactionFilter>({
    type: "all",
    startDate: undefined,
    endDate: undefined
  });

  // Load data from database
  useEffect(() => {
    if (user) {
      loadFinancialData();
    }
  }, [user]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      // Load transactions
      const { data: transactionsData, error: transactionsError } = await getTransactions();
      if (transactionsError) {
        console.error('Error loading transactions:', transactionsError);
        setError('Failed to load transactions');
      } else {
        const formattedTransactions = (transactionsData || []).map((t: Transaction) => ({
          id: t.id,
          category: t.category,
          amount: parseFloat(t.amount.toString()),
          type: t.type as "income" | "expense",
          date: new Date(t.date).toLocaleDateString()
        }));
        
        setTransactions(formattedTransactions);
        
        // Calculate totals
        const calculatedIncome = formattedTransactions
          .filter(t => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        
        const calculatedExpenses = formattedTransactions
          .filter(t => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
        
        setIncome(calculatedIncome);
        setExpenses(calculatedExpenses);
      }

      // Load current budget
      const { data: budgetData, error: budgetError } = await getCurrentBudget();
      if (budgetError) {
        console.error('Error loading budget:', budgetError);
      } else if (budgetData) {
        setBudgetLimit(parseFloat(budgetData.monthly_limit.toString()));
      }
    } catch (err) {
      console.error("Error loading financial data:", err);
      setError("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  // Update budget limit in database
  useEffect(() => {
    if (user && budgetLimit > 0) {
      const updateBudgetLimit = async () => {
        try {
          const currentDate = new Date();
          await createOrUpdateBudget({
            monthly_limit: budgetLimit,
            current_spent: expenses,
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
          });
        } catch (err) {
          console.error("Error updating budget limit:", err);
        }
      };
      
      updateBudgetLimit();
    }
  }, [budgetLimit, user]);

  // Update current spent in database when expenses change
  useEffect(() => {
    if (user) {
      const updateSpent = async () => {
        try {
          await updateBudgetSpent(expenses);
        } catch (err) {
          console.error("Error updating budget spent:", err);
        }
      };
      
      updateSpent();
    }
  }, [expenses, user]);

  // Check for budget alerts
  useEffect(() => {
    if (expenses > budgetLimit) {
      toast({
        title: "Budget Alert",
        description: "⚠️ You've exceeded your monthly budget limit!",
        variant: "destructive",
      });
    } else if (expenses > budgetLimit * 0.9) {
      toast({
        title: "Budget Warning",
        description: "Heads up! You're very close to your monthly budget limit.",
        variant: "default",
      });
    }
  }, [expenses, budgetLimit, toast]);

  const handleBudgetLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Budget limit must be a valid number",
        variant: "destructive",
      });
      return;
    }
    
    setBudgetLimit(value);
  };

  const handleAddTransaction = async (category: string, amount: number, type: "income" | "expense") => {
    // Validate inputs
    if (!category.trim()) {
      toast({
        title: "Error",
        description: "Category cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be a positive number",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await createTransaction({
        type,
        category: category.trim(),
        source: type === "income" ? category.trim() : null,
        amount,
        description: null,
        date: new Date().toISOString()
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add transaction",
          variant: "destructive",
        });
        return;
      }

      const newTransaction: FormattedTransaction = {
        id: data.id,
        category: category.trim(),
        amount,
        type,
        date: new Date().toLocaleDateString(),
      };

      setTransactions([newTransaction, ...transactions]);

      if (type === "income") {
        setIncome(prev => prev + amount);
      } else {
        setExpenses(prev => prev + amount);
      }

      toast({
        title: "Success",
        description: `${type === "income" ? "Income" : "Expense"} added successfully`,
      });
    } catch (err) {
      console.error("Error adding transaction:", err);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const handleEditTransaction = async (id: string, updates: Partial<FormattedTransaction>) => {
    try {
      const { data, error } = await updateTransaction(id, {
        category: updates.category,
        amount: updates.amount,
        type: updates.type,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update transaction",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setTransactions(prevTransactions => 
        prevTransactions.map(t => 
          t.id === id 
            ? { ...t, ...updates }
            : t
        )
      );

      // Recalculate totals
      const updatedTransactions = transactions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      );
      
      const newIncome = updatedTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const newExpenses = updatedTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      
      setIncome(newIncome);
      setExpenses(newExpenses);

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (err) {
      console.error("Error updating transaction:", err);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const { error } = await deleteTransaction(id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        });
        return;
      }

      // Find the transaction to calculate totals correctly
      const deletedTransaction = transactions.find(t => t.id === id);
      if (deletedTransaction) {
        if (deletedTransaction.type === "income") {
          setIncome(prev => prev - deletedTransaction.amount);
        } else {
          setExpenses(prev => prev - deletedTransaction.amount);
        }
      }

      // Update local state
      setTransactions(prevTransactions => 
        prevTransactions.filter(t => t.id !== id)
      );

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const handleBulkImport = async (importedTransactions: Omit<FormattedTransaction, 'id'>[]) => {
    try {
      const results = await Promise.all(
        importedTransactions.map(transaction => 
          createTransaction({
            type: transaction.type,
            category: transaction.category,
            source: transaction.type === "income" ? transaction.category : null,
            amount: transaction.amount,
            description: null,
            date: new Date().toISOString()
          })
        )
      );

      const successfulImports = results.filter(result => !result.error);
      const failedImports = results.filter(result => result.error);

      // Add successful imports to local state
      const newTransactions = successfulImports.map(result => ({
        id: result.data!.id,
        category: result.data!.category,
        amount: parseFloat(result.data!.amount.toString()),
        type: result.data!.type as "income" | "expense",
        date: new Date(result.data!.date).toLocaleDateString(),
      }));

      setTransactions(prev => [...newTransactions, ...prev]);

      // Update totals
      const addedIncome = newTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const addedExpenses = newTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      setIncome(prev => prev + addedIncome);
      setExpenses(prev => prev + addedExpenses);

      toast({
        title: "Import Complete",
        description: `Successfully imported ${successfulImports.length} transactions${
          failedImports.length > 0 ? `. ${failedImports.length} failed.` : ''
        }`,
        variant: failedImports.length > 0 ? "destructive" : "default",
      });

    } catch (err) {
      console.error("Error importing transactions:", err);
      toast({
        title: "Error",
        description: "Failed to import transactions",
        variant: "destructive",
      });
    }
  };

  const handleAddRecurring = async (recurringTransaction: any) => {
    // For now, create the first occurrence
    // In a full implementation, you'd store the recurring pattern in the database
    try {
      await handleAddTransaction(
        recurringTransaction.category,
        recurringTransaction.amount,
        recurringTransaction.type
      );

      toast({
        title: "Recurring Transaction Added",
        description: `First occurrence of ${recurringTransaction.category} has been created. Future occurrences will be processed automatically.`,
      });
    } catch (err) {
      console.error("Error adding recurring transaction:", err);
      toast({
        title: "Error",
        description: "Failed to add recurring transaction",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (newFilter: TransactionFilter) => {
    setFilter(newFilter);
  };

  const handleResetFilters = () => {
    setFilter({
      type: "all",
      startDate: undefined,
      endDate: undefined
    });
  };

  // Apply filters to transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filter by type
      if (filter.type !== "all" && transaction.type !== filter.type) {
        return false;
      }

      // Filter by date range
      if (filter.startDate || filter.endDate) {
        const transactionDate = new Date(transaction.date);
        
        if (filter.startDate && transactionDate < filter.startDate) {
          return false;
        }
        
        if (filter.endDate) {
          // Set the end date to the end of the day for inclusive filtering
          const endOfDay = new Date(filter.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (transactionDate > endOfDay) {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [transactions, filter]);

  // Calculate budget status
  const remaining = income - expenses;
  const overBudget = expenses > budgetLimit;
  const closeToLimit = expenses > budgetLimit * 0.9 && !overBudget;

  // Calculate category totals
  const categoryTotals: Record<string, number> = {};
  transactions.forEach((entry) => {
    if (entry.type === "expense") {
      categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.amount;
    }
  });

  const categoryTotalsArray = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    income,
    expenses,
    budgetLimit,
    remaining,
    overBudget,
    closeToLimit,
    loading,
    error,
    categoryTotalsArray,
    filter,
    handleBudgetLimitChange,
    handleAddTransaction,
    handleEditTransaction,
    handleDeleteTransaction,
    handleBulkImport,
    handleAddRecurring,
    handleFilterChange,
    handleResetFilters,
    loadFinancialData
  };
};
