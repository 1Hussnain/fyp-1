
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

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
  const { toast } = useToast();
  
  // Form validation
  const validateIncomeForm = () => {
    const errors: {source?: string; amount?: string} = {};
    
    if (!incomeForm.source.trim()) {
      errors.source = "Source is required";
    }
    
    if (!incomeForm.amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(Number(incomeForm.amount)) || Number(incomeForm.amount) <= 0) {
      errors.amount = "Amount must be a positive number";
    }
    
    return errors;
  };
  
  const validateExpenseForm = () => {
    const errors: {category?: string; amount?: string} = {};
    
    if (!expenseForm.category.trim()) {
      errors.category = "Category is required";
    }
    
    if (!expenseForm.amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(Number(expenseForm.amount)) || Number(expenseForm.amount) <= 0) {
      errors.amount = "Amount must be a positive number";
    }
    
    return errors;
  };
  
  const handleIncomeSubmit = () => {
    const errors = validateIncomeForm();
    
    if (Object.keys(errors).length > 0) {
      // Show error toast
      toast({
        title: "Error",
        description: Object.values(errors)[0],
        variant: "destructive",
      });
      return;
    }
    
    handleAddIncome();
    toast({
      title: "Success",
      description: "Income added successfully",
    });
  };
  
  const handleExpenseSubmit = () => {
    const errors = validateExpenseForm();
    
    if (Object.keys(errors).length > 0) {
      // Show error toast
      toast({
        title: "Error",
        description: Object.values(errors)[0],
        variant: "destructive",
      });
      return;
    }
    
    handleAddExpense();
    toast({
      title: "Success",
      description: "Expense added successfully",
    });
  };

  const incomeSourceInvalid = !incomeForm.source.trim();
  const incomeAmountInvalid = !incomeForm.amount || isNaN(Number(incomeForm.amount)) || Number(incomeForm.amount) <= 0;
  const expenseCategoryInvalid = !expenseForm.category.trim();
  const expenseAmountInvalid = !expenseForm.amount || isNaN(Number(expenseForm.amount)) || Number(expenseForm.amount) <= 0;

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
                  className={incomeSourceInvalid && incomeForm.source !== "" ? "border-red-300" : ""}
                />
                {incomeSourceInvalid && incomeForm.source !== "" && (
                  <p className="text-xs text-red-500 mt-1">Source is required</p>
                )}
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
                  className={incomeAmountInvalid && incomeForm.amount !== "" ? "border-red-300" : ""}
                />
                {incomeAmountInvalid && incomeForm.amount !== "" && (
                  <p className="text-xs text-red-500 mt-1">Valid amount is required</p>
                )}
              </div>
              <Button 
                onClick={handleIncomeSubmit} 
                className="mt-2 sm:mt-0"
                disabled={incomeSourceInvalid || incomeAmountInvalid}
              >
                Add Income
              </Button>
            </div>
            
            {(incomeSourceInvalid || incomeAmountInvalid) && 
             (incomeForm.source !== "" || incomeForm.amount !== "") && (
              <div className="text-sm text-red-500 flex items-center gap-1 mt-4">
                <AlertTriangle className="h-4 w-4" />
                <span>Please fix the errors above</span>
              </div>
            )}
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
                  className={expenseCategoryInvalid && expenseForm.category !== "" ? "border-red-300" : ""}
                />
                {expenseCategoryInvalid && expenseForm.category !== "" && (
                  <p className="text-xs text-red-500 mt-1">Category is required</p>
                )}
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
                  className={expenseAmountInvalid && expenseForm.amount !== "" ? "border-red-300" : ""}
                />
                {expenseAmountInvalid && expenseForm.amount !== "" && (
                  <p className="text-xs text-red-500 mt-1">Valid amount is required</p>
                )}
              </div>
              <Button 
                onClick={handleExpenseSubmit}
                className="mt-2 sm:mt-0"
                variant="outline"
                disabled={expenseCategoryInvalid || expenseAmountInvalid}
              >
                Add Expense
              </Button>
            </div>
            
            {(expenseCategoryInvalid || expenseAmountInvalid) && 
             (expenseForm.category !== "" || expenseForm.amount !== "") && (
              <div className="text-sm text-red-500 flex items-center gap-1 mt-4">
                <AlertTriangle className="h-4 w-4" />
                <span>Please fix the errors above</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TransactionForm;
