
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TransactionForm from "./TransactionForm";

interface TransactionTabsProps {
  activeTab: "income" | "expense";
  setActiveTab: (value: "income" | "expense") => void;
  incomeForm: { source: string; amount: string };
  expenseForm: { category: string; amount: string };
  handleIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpenseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddIncome: () => void;
  handleAddExpense: () => void;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({
  activeTab,
  setActiveTab,
  incomeForm,
  expenseForm,
  handleIncomeChange,
  handleExpenseChange,
  handleAddIncome,
  handleAddExpense,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "income" | "expense")}>
      <TabsList className="mb-6">
        <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
        <TabsTrigger value="expense" className="flex-1">Expenses</TabsTrigger>
      </TabsList>
      
      <TabsContent value="income">
        <TransactionForm
          activeTab="income"
          incomeForm={incomeForm}
          expenseForm={expenseForm}
          handleIncomeChange={handleIncomeChange}
          handleExpenseChange={handleExpenseChange}
          handleAddIncome={handleAddIncome}
          handleAddExpense={handleAddExpense}
        />
      </TabsContent>
      
      <TabsContent value="expense">
        <TransactionForm
          activeTab="expense"
          incomeForm={incomeForm}
          expenseForm={expenseForm}
          handleIncomeChange={handleIncomeChange}
          handleExpenseChange={handleExpenseChange}
          handleAddIncome={handleAddIncome}
          handleAddExpense={handleAddExpense}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TransactionTabs;
