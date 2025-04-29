
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AlertTriangle } from "lucide-react";

interface TransactionFormProps {
  onAddTransaction: (category: string, amount: number, type: "income" | "expense") => void;
}

const formSchema = z.object({
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  amount: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    {
      message: "Amount must be a positive number.",
    }
  ),
  type: z.enum(["income", "expense"])
});

type FormValues = z.infer<typeof formSchema>;

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      amount: "",
      type: "expense",
    },
  });

  const handleSubmit = (values: FormValues) => {
    const amountValue = Number(values.amount);
    
    onAddTransaction(values.category, amountValue, values.type);

    // Reset form
    form.reset({
      category: "",
      amount: "",
      type: "expense",
    });

    toast({
      title: "Success",
      description: `${values.type === "income" ? "Income" : "Expense"} added successfully`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-white p-6 rounded-xl shadow-sm space-y-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium mb-1 block">
                  Category
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Rent, Groceries, Salary"
                    className={`${form.formState.errors.category ? "border-red-300" : ""}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium mb-1 block">
                  Amount
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`${form.formState.errors.amount ? "border-red-300" : ""}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium mb-1 block">
                  Type
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={form.formState.isSubmitting}
        >
          Add Entry
        </Button>
        
        {(form.formState.errors.category || form.formState.errors.amount) && (
          <div className="text-sm text-red-500 flex items-center gap-1 mt-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Please fix the errors above</span>
          </div>
        )}
      </form>
    </Form>
  );
};

export default TransactionForm;
