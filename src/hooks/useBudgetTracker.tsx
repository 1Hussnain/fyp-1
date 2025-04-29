
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

  // Load data from localStorage on initial render
  useEffect(() => {
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
      setBudgetLimit(Number(storedBudgetLimit));
    }
  }, []);

  // Save data to localStorage when transactions change
  useEffect(() => {
    localStorage.setItem("budget-transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Save budget limit to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("budget-limit", budgetLimit.toString());
  }, [budgetLimit]);

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
    setBudgetLimit(Number(e.target.value));
  };

  const handleAddTransaction = (category: string, amount: number, type: "income" | "expense") => {
    const newEntry: Transaction = {
      id: Date.now().toString(),
      category,
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
    categoryTotalsArray,
    handleBudgetLimitChange,
    handleAddTransaction
  };
};
