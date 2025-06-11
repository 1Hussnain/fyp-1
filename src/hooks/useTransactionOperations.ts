
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { transactionService, FormattedTransaction } from "@/services/transactionService";

export const useTransactionOperations = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const addTransaction = async (category: string, amount: number, type: "income" | "expense") => {
    if (!category.trim()) {
      toast({
        title: "Error",
        description: "Category cannot be empty",
        variant: "destructive",
      });
      return false;
    }
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be a positive number",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      const { data, error } = await transactionService.createTransaction({
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
        return false;
      }

      toast({
        title: "Success",
        description: `${type === "income" ? "Income" : "Expense"} added successfully`,
      });
      return data;
    } catch (err) {
      console.error("Error adding transaction:", err);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editTransaction = async (id: string, updates: Partial<FormattedTransaction>) => {
    setLoading(true);
    try {
      const { error } = await transactionService.updateTransaction(id, updates);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update transaction",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
      return true;
    } catch (err) {
      console.error("Error updating transaction:", err);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await transactionService.deleteTransaction(id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      return true;
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addTransaction,
    editTransaction,
    deleteTransaction,
    loading
  };
};
