
import { useTransactions } from "./useTransactions";
import { useCategories } from "./useCategories";
import { useMemo } from "react";
import { CategorySpending } from "@/types/database";

export const useOptimizedFinancial = () => {
  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactions();

  const { categories, addCategory } = useCategories();

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const categoryTotals: Record<string, number> = {};
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

    transactions
      .filter(t => t.type === "expense")
      .forEach(transaction => {
        const categoryName = transaction.categories?.name || 'Uncategorized';
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Number(transaction.amount);
      });

    const categorySpending: CategorySpending[] = Object.entries(categoryTotals)
      .map(([name, amount], index) => ({
        name,
        amount,
        fill: colors[index % colors.length],
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      transactionCount: transactions.length,
      categorySpending
    };
  }, [transactions]);

  const handleAddTransaction = async (data: any) => {
    const result = await addTransaction(data);
    return result.success;
  };

  const handleUpdateTransaction = async (id: string, updates: any) => {
    const result = await updateTransaction(id, updates);
    return result.success;
  };

  const handleDeleteTransaction = async (id: string) => {
    const result = await deleteTransaction(id);
    return result.success;
  };

  const handleAddCategory = async (data: any) => {
    const result = await addCategory(data);
    return result.success;
  };

  return {
    transactions,
    categories,
    summary,
    loading: transactionsLoading,
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,
    addCategory: handleAddCategory
  };
};
