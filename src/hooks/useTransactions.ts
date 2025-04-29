
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  source?: string;
  category?: string;
  date: string;
}

export const useTransactions = () => {
  const { toast } = useToast();
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
