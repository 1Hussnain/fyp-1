
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

export const useBudgetTracker = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [budgetLimit, setBudgetLimit] = useState(100000);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem("budget-transactions");
      const storedBudgetLimit = localStorage.getItem("budget-limit");
      
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions);
        setTransactions(parsedTransactions);
        
        // Calculate totals from stored transactions
        const calculatedIncome = parsedTransactions
          .filter((t: Transaction) => t.type === "income")
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        
        const calculatedExpenses = parsedTransactions
          .filter((t: Transaction) => t.type === "expense")
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        
        setIncome(calculatedIncome);
        setExpenses(calculatedExpenses);
      }
      
      if (storedBudgetLimit) {
        const parsedLimit = Number(storedBudgetLimit);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          setBudgetLimit(parsedLimit);
        }
      }
    } catch (err) {
      console.error("Error loading budget data:", err);
      setError("Failed to load saved budget data");
      toast({
        title: "Error",
        description: "Failed to load saved budget data",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Save data to localStorage when transactions change
  useEffect(() => {
    try {
      localStorage.setItem("budget-transactions", JSON.stringify(transactions));
    } catch (err) {
      console.error("Error saving transaction data:", err);
      toast({
        title: "Error",
        description: "Failed to save transaction data",
        variant: "destructive",
      });
    }
  }, [transactions, toast]);

  // Save budget limit to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("budget-limit", budgetLimit.toString());
    } catch (err) {
      console.error("Error saving budget limit:", err);
      toast({
        title: "Error",
        description: "Failed to save budget limit",
        variant: "destructive",
      });
    }
  }, [budgetLimit, toast]);

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

  const handleAddTransaction = (category: string, amount: number, type: "income" | "expense") => {
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

    const newEntry: Transaction = {
      id: Date.now().toString(),
      category: category.trim(),
      amount,
      type,
      date: new Date().toLocaleDateString(),
    };

    setTransactions([newEntry, ...transactions]);

    if (type === "income") {
      setIncome(prev => prev + amount);
    } else {
      setExpenses(prev => prev + amount);
    }
  };

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
    transactions,
    income,
    expenses,
    budgetLimit,
    remaining,
    overBudget,
    closeToLimit,
    error,
    categoryTotalsArray,
    handleBudgetLimitChange,
    handleAddTransaction
  };
};
