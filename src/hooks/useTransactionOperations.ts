import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { transactionService, FormattedTransaction } from "@/services/transactionService";
import { transactionSchema, validateData } from "@/utils/validation";
import { useErrorHandler } from "./useErrorHandler";

export const useTransactionOperations = () => {
  const { toast } = useToast();
  const { handleError, handleSuccess } = useErrorHandler();
  const [loading, setLoading] = useState(false);

  const addTransaction = async (category: string, amount: number, type: "income" | "expense") => {
    // Validate input data
    const validation = validateData(transactionSchema, {
      category: category.trim(),
      amount,
      type
    });

    if (!validation.success) {
      validation.errors.forEach(error => {
        toast({
          title: "Validation Error",
          description: error,
          variant: "destructive",
        });
      });
      return false;
    }

    setLoading(true);
    try {
      const { data, error } = await transactionService.createTransaction({
        type,
        category: validation.data.category,
        source: type === "income" ? validation.data.category : null,
        amount: validation.data.amount,
        description: null,
        date: new Date().toISOString()
      });

      if (error) {
        handleError(error, "adding transaction");
        return false;
      }

      handleSuccess(`${type === "income" ? "Income" : "Expense"} added successfully`);
      return data;
    } catch (err) {
      handleError(err, "adding transaction");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editTransaction = async (id: string, updates: Partial<FormattedTransaction>) => {
    // Validate updates if they contain validatable fields
    if (updates.category || updates.amount || updates.type) {
      const validation = validateData(transactionSchema.partial(), updates);
      if (!validation.success) {
        validation.errors.forEach(error => {
          toast({
            title: "Validation Error",
            description: error,
            variant: "destructive",
          });
        });
        return false;
      }
    }

    setLoading(true);
    try {
      const { data, error } = await transactionService.updateTransaction(id, updates);

      if (error) {
        handleError(error, "updating transaction");
        return false;
      }

      handleSuccess("Transaction updated successfully");
      return true;
    } catch (err) {
      handleError(err, "updating transaction");
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
        handleError(error, "deleting transaction");
        return false;
      }

      handleSuccess("Transaction deleted successfully");
      return true;
    } catch (err) {
      handleError(err, "deleting transaction");
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
