
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionFormProps {
  activeTab: "income" | "expense";
  incomeForm: { source: string; amount: string };
  expenseForm: { category: string; amount: string };
  handleIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpenseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddIncome: () => void;
  handleAddExpense: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  activeTab,
  incomeForm,
  expenseForm,
  handleIncomeChange,
  handleExpenseChange,
  handleAddIncome,
  handleAddExpense
}) => {
  return (
    <>
      {activeTab === "income" ? (
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
      ) : (
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
      )}
    </>
  );
};

export default TransactionForm;
