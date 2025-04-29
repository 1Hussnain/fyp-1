
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  source?: string;
  category?: string;
  date: string;
}

interface TransactionFilter {
  type: "all" | "income" | "expense";
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const useTransactions = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");
  const [incomeForm, setIncomeForm] = useState({ source: "", amount: "" });
  const [expenseForm, setExpenseForm] = useState({ category: "", amount: "" });
  const [filter, setFilter] = useState<TransactionFilter>({
    type: "all",
    startDate: undefined,
    endDate: undefined
  });

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

  const handleAddIncome = () => {
    if (!validateIncomeForm()) {
      return;
    }
    
    const newEntry: Transaction = {
      id: Date.now().toString(),
      type: "income",
      source: incomeForm.source.trim(),
      amount: parseFloat(incomeForm.amount),
      date: new Date().toLocaleString(),
    };
    
    setTransactions([newEntry, ...transactions]);
    setIncomeForm({ source: "", amount: "" });
  };

  const handleAddExpense = () => {
    if (!validateExpenseForm()) {
      return;
    }
    
    const newEntry: Transaction = {
      id: Date.now().toString(),
      type: "expense",
      category: expenseForm.category.trim(),
      amount: parseFloat(expenseForm.amount),
      date: new Date().toLocaleString(),
    };
    
    setTransactions([newEntry, ...transactions]);
    setExpenseForm({ category: "", amount: "" });
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

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    activeTab,
    setActiveTab,
    incomeForm,
    expenseForm,
    filter,
    handleIncomeChange,
    handleExpenseChange,
    handleAddIncome,
    handleAddExpense,
    handleFilterChange,
    handleResetFilters
  };
};
