
import { useState } from "react";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  source?: string;
  category?: string;
  date: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");
  const [incomeForm, setIncomeForm] = useState({ source: "", amount: "" });
  const [expenseForm, setExpenseForm] = useState({ category: "", amount: "" });

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncomeForm({ ...incomeForm, [e.target.name]: e.target.value });
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });
  };

  const handleAddIncome = () => {
    if (!incomeForm.source || !incomeForm.amount) {
      alert("Please fill all fields");
      return;
    }
    
    const newEntry: Transaction = {
      id: Date.now().toString(),
      type: "income",
      source: incomeForm.source,
      amount: parseFloat(incomeForm.amount),
      date: new Date().toLocaleString(),
    };
    
    setTransactions([newEntry, ...transactions]);
    setIncomeForm({ source: "", amount: "" });
  };

  const handleAddExpense = () => {
    if (!expenseForm.category || !expenseForm.amount) {
      alert("Please fill all fields");
      return;
    }
    
    const newEntry: Transaction = {
      id: Date.now().toString(),
      type: "expense",
      category: expenseForm.category,
      amount: parseFloat(expenseForm.amount),
      date: new Date().toLocaleString(),
    };
    
    setTransactions([newEntry, ...transactions]);
    setExpenseForm({ category: "", amount: "" });
  };

  return {
    transactions,
    activeTab,
    setActiveTab,
    incomeForm,
    expenseForm,
    handleIncomeChange,
    handleExpenseChange,
    handleAddIncome,
    handleAddExpense
  };
};
