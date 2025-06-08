
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getTransactions, 
  createTransaction, 
  Transaction 
} from "@/services/financialDatabase";

interface TransactionFilter {
  type: "all" | "income" | "expense";
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const useTransactionsDB = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");
  const [incomeForm, setIncomeForm] = useState({ source: "", amount: "" });
  const [expenseForm, setExpenseForm] = useState({ category: "", amount: "" });
  const [filter, setFilter] = useState<TransactionFilter>({
    type: "all",
    startDate: undefined,
    endDate: undefined
  });

  // Load transactions from database
  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await getTransactions();
      if (error) {
        console.error('Error loading transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      } else {
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncomeForm({ ...incomeForm, [e.target.name]: e.target.value });
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });
  };

  const validateIncomeForm = (): boolean => {
    if (!incomeForm.source.trim()) {
      return false;
    }
    
    const amountValue = Number(incomeForm.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return false;
    }
    
    return true;
  };
  
  const validateExpenseForm = (): boolean => {
    if (!expenseForm.category.trim()) {
      return false;
    }
    
    const amountValue = Number(expenseForm.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return false;
    }
    
    return true;
  };

  const handleAddIncome = async () => {
    if (!validateIncomeForm()) {
      return;
    }
    
    try {
      const { data, error } = await createTransaction({
        type: "income",
        category: incomeForm.source.trim(),
        source: incomeForm.source.trim(),
        amount: parseFloat(incomeForm.amount),
        description: null,
        date: new Date().toISOString()
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add income",
          variant: "destructive",
        });
      } else {
        setTransactions([data, ...transactions]);
        setIncomeForm({ source: "", amount: "" });
        toast({
          title: "Success",
          description: "Income added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding income:', error);
      toast({
        title: "Error",
        description: "Failed to add income",
        variant: "destructive",
      });
    }
  };

  const handleAddExpense = async () => {
    if (!validateExpenseForm()) {
      return;
    }
    
    try {
      const { data, error } = await createTransaction({
        type: "expense",
        category: expenseForm.category.trim(),
        source: null,
        amount: parseFloat(expenseForm.amount),
        description: null,
        date: new Date().toISOString()
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add expense",
          variant: "destructive",
        });
      } else {
        setTransactions([data, ...transactions]);
        setExpenseForm({ category: "", amount: "" });
        toast({
          title: "Success",
          description: "Expense added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
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

  // Convert database transactions to the format expected by components
  const formattedTransactions = useMemo(() => {
    return filteredTransactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type as "income" | "expense",
      amount: parseFloat(transaction.amount.toString()),
      source: transaction.source || undefined,
      category: transaction.category,
      date: new Date(transaction.date).toLocaleString()
    }));
  }, [filteredTransactions]);

  return {
    transactions: formattedTransactions,
    allTransactions: transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type as "income" | "expense",
      amount: parseFloat(transaction.amount.toString()),
      source: transaction.source || undefined,
      category: transaction.category,
      date: new Date(transaction.date).toLocaleString()
    })),
    activeTab,
    setActiveTab,
    incomeForm,
    expenseForm,
    filter,
    loading,
    handleIncomeChange,
    handleExpenseChange,
    handleAddIncome,
    handleAddExpense,
    handleFilterChange,
    handleResetFilters,
    loadTransactions
  };
};
