
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TransactionWithCategory } from "@/services/optimizedFinancialService";
import { transactionSchema, validateData } from "@/utils/validation";
import { useErrorHandler } from "./useErrorHandler";

export const useTransactionOperations = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
      if ('errors' in validation) {
        validation.errors.forEach(error => {
          toast({
            title: "Validation Error",
            description: error,
            variant: "destructive",
          });
        });
      }
      return false;
    }

    setLoading(true);
    try {
      // Find or create category
      let categoryId = null;
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', validation.data.category)
        .eq('type', type)
        .maybeSingle();

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({
            name: validation.data.category,
            type,
            user_id: user?.id
          })
          .select('id')
          .single();

        if (categoryError) throw categoryError;
        categoryId = newCategory.id;
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          type,
          category_id: categoryId,
          amount: validation.data.amount,
          description: null,
          date: new Date().toISOString().split('T')[0]
        })
        .select(`
          *,
          categories(*)
        `)
        .single();

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

  const editTransaction = async (id: string, updates: Partial<TransactionWithCategory>) => {
    // Validate updates if they contain validatable fields
    if (updates.amount || updates.type) {
      const validation = validateData(transactionSchema.partial(), updates);
      if (!validation.success) {
        if ('errors' in validation) {
          validation.errors.forEach(error => {
            toast({
              title: "Validation Error",
              description: error,
              variant: "destructive",
            });
          });
        }
        return false;
      }
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          categories(*)
        `)
        .single();

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
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

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
