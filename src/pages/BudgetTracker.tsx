
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

const BudgetTracker = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [budgetLimit, setBudgetLimit] = useState(100000);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    type: "expense" as "income" | "expense",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.name === "amount" ? e.target.value : e.target.value,
    });
  };

  const handleBudgetLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudgetLimit(Number(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.category || !form.amount) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const amountValue = Number(form.amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid amount",
        description: "Amount must be a positive number",
        variant: "destructive",
      });
      return;
    }

    const newEntry: Transaction = {
      id: Date.now().toString(),
      category: form.category,
      amount: amountValue,
      type: form.type,
      date: new Date().toLocaleDateString(),
    };

    setTransactions([newEntry, ...transactions]);

    if (form.type === "income") {
      setIncome(prev => prev + amountValue);
    } else {
      setExpenses(prev => prev + amountValue);
    }

    // Reset form
    setForm({
      category: "",
      amount: "",
      type: "expense",
    });
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Budget Tracker</h2>

        {/* Budget Limit Setting */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label htmlFor="budgetLimit" className="text-sm font-medium">
              Monthly Budget Limit:
            </label>
            <Input
              id="budgetLimit"
              type="number"
              min="0"
              step="1000"
              value={budgetLimit}
              onChange={handleBudgetLimitChange}
              className="max-w-xs"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-100 shadow border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-green-800">Monthly Income</p>
              <p className="text-2xl font-bold text-green-700">${income.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-100 shadow border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-red-800">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-700">${expenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-100 shadow border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-blue-800">Remaining Budget</p>
              <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-700' : 'text-blue-700'}`}>
                ${remaining.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          
          <Card className={`${overBudget ? 'bg-red-100' : closeToLimit ? 'bg-yellow-100' : 'bg-gray-100'} shadow border-0`}>
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-gray-800">Budget Status</p>
              <p className={`text-sm font-bold ${overBudget ? 'text-red-700' : closeToLimit ? 'text-yellow-700' : 'text-gray-700'}`}>
                {overBudget ? (
                  <><AlertTriangle className="inline-block h-4 w-4 mr-1" /> Over budget!</>
                ) : closeToLimit ? (
                  <><AlertTriangle className="inline-block h-4 w-4 mr-1" /> Near limit!</>
                ) : (
                  "Within budget"
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Entry Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="text-sm font-medium mb-1 block">
                Category
              </label>
              <Input
                id="category"
                name="category"
                value={form.category}
                onChange={handleInputChange}
                placeholder="e.g., Rent, Groceries, Salary"
              />
            </div>
            <div>
              <label htmlFor="amount" className="text-sm font-medium mb-1 block">
                Amount
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="type" className="text-sm font-medium mb-1 block">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            Add Entry
          </Button>
        </form>

        {/* Category Breakdown */}
        {categoryTotalsArray.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
            <div className="space-y-3">
              {categoryTotalsArray.map(({ category, amount }) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span className="font-medium">${amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (amount / expenses) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 my-6">No transactions yet. Add your first one above!</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {transactions.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border text-sm"
                >
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  <div className={`flex items-center ${item.type === "expense" ? "text-red-600" : "text-green-600"}`}>
                    {item.type === "expense" ? (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    )}
                    ${item.amount.toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetTracker;
