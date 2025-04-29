
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TransactionFormProps {
  onAddTransaction: (category: string, amount: number, type: "income" | "expense") => void;
}

interface FormState {
  category: string;
  amount: string;
  type: "income" | "expense";
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>({
    category: "",
    amount: "",
    type: "expense",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.name === "amount" ? e.target.value : e.target.value,
    });
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

    onAddTransaction(form.category, amountValue, form.type);

    // Reset form
    setForm({
      category: "",
      amount: "",
      type: "expense",
    });
  };

  return (
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
  );
};

export default TransactionForm;
