
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  source?: string;
  category?: string;
  date: string;
}

const IncomeExpenses = () => {
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  return (
    <div className="p-6 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Income & Expenses</h2>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "income" | "expense")}>
            <TabsList className="mb-6">
              <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
              <TabsTrigger value="expense" className="flex-1">Expenses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="income">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label htmlFor="source" className="text-sm font-medium mb-1 block text-gray-700">
                        Source
                      </label>
                      <Input
                        id="source"
                        name="source"
                        placeholder="Salary, Freelance, etc."
                        value={incomeForm.source}
                        onChange={handleIncomeChange}
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <label htmlFor="income-amount" className="text-sm font-medium mb-1 block text-gray-700">
                        Amount
                      </label>
                      <Input
                        id="income-amount"
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={incomeForm.amount}
                        onChange={handleIncomeChange}
                      />
                    </div>
                    <Button 
                      onClick={handleAddIncome} 
                      className="mt-2 sm:mt-0"
                    >
                      Add Income
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="expense">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label htmlFor="category" className="text-sm font-medium mb-1 block text-gray-700">
                        Category
                      </label>
                      <Input
                        id="category"
                        name="category"
                        placeholder="Food, Rent, Transportation, etc."
                        value={expenseForm.category}
                        onChange={handleExpenseChange}
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <label htmlFor="expense-amount" className="text-sm font-medium mb-1 block text-gray-700">
                        Amount
                      </label>
                      <Input
                        id="expense-amount"
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={expenseForm.amount}
                        onChange={handleExpenseChange}
                      />
                    </div>
                    <Button 
                      onClick={handleAddExpense}
                      className="mt-2 sm:mt-0"
                      variant="outline"
                    >
                      Add Expense
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Transaction History</h3>
          
          <div className="border rounded-xl p-4">
            <ScrollArea className="h-64">
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No transactions yet.</p>
                  <p className="text-sm">Add your first transaction above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between items-center p-3 rounded-lg border bg-white"
                    >
                      <div>
                        <p className="font-medium">
                          {transaction.type === "income" ? transaction.source : transaction.category}
                        </p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                      
                      <Badge 
                        variant={transaction.type === "income" ? "default" : "outline"}
                        className={transaction.type === "income" 
                          ? "bg-green-100 hover:bg-green-200 text-green-800 hover:text-green-800" 
                          : "bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-800 border-red-200"}
                      >
                        {transaction.type === "income" ? "+" : "-"} 
                        ${transaction.amount.toFixed(2)}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IncomeExpenses;
