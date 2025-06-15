
import React from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import OptimizedTransactionTable, { TransactionWithCategory as TableTransactionWithCategory } from "@/components/financial/OptimizedTransactionTable";
import OptimizedCategoryChart from "@/components/financial/OptimizedCategoryChart";
import CategoryManagementDialog from "@/components/financial/CategoryManagementDialog";
import FinancialInsightsCard from "@/components/financial/FinancialInsightsCard";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

interface CategoryData {
  category: string;
  amount: number;
  color: string;
  icon: string;
  percentage: number;
}

const OptimizedFinancialManagement = () => {
  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch
  } = useTransactions();

  const { categories } = useCategories();

  // Calculate financial summary and category spending
  const { summary, categoryData } = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate category spending with proper structure
    const categoryTotals: Record<string, number> = {};
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];
    
    transactions
      .filter(t => t.type === "expense")
      .forEach(transaction => {
        const categoryName = transaction.categories?.name || 'Uncategorized';
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Number(transaction.amount);
      });

    const categorySpendingData: CategoryData[] = Object.entries(categoryTotals)
      .map(([name, amount], index) => ({
        category: name,
        amount,
        color: colors[index % colors.length],
        icon: 'DollarSign', // Default icon
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      summary: {
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        transactionCount: transactions.length
      },
      categoryData: categorySpendingData
    };
  }, [transactions]);

  const loading = transactionsLoading;

  // Convert transaction types for table to match expected union type
  const normalizedTransactions: TableTransactionWithCategory[] = transactions.map(t => ({
    ...t,
    type: t.type === "income" ? "income" : "expense"
  }));

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Transactions</h2>
          <OptimizedTransactionTable
            transactions={normalizedTransactions}
            categories={categories}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <OptimizedCategoryChart
            data={categoryData}
          />
          
          <div className="space-y-6">
            <CategoryManagementDialog />
            
            <FinancialInsightsCard 
              totalIncome={summary.totalIncome}
              totalExpenses={summary.totalExpenses}
              netSavings={summary.netIncome}
              savingsGoal={summary.netIncome}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedFinancialManagement;
