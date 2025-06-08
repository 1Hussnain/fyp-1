
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getTransactions, 
  createTransaction, 
  getCurrentBudget, 
  createOrUpdateBudget,
  updateBudgetSpent,
  Transaction 
} from "@/services/financialDatabase";

interface BudgetTransaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

export const useBudgetTrackerDB = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [budgetLimit, setBudgetLimit] = useState(100000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from database
  useEffect(() => {
    if (user) {
      loadBudgetData();
    }
  }, [user]);

  const loadBudgetData = async () => {
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
      console.error("Error loading budget data:", err);
      setError("Failed to load budget data");
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

      const newTransaction: BudgetTransaction = {
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
    loading,
    error,
    categoryTotalsArray,
    handleBudgetLimitChange,
    handleAddTransaction,
    loadBudgetData
  };
};
