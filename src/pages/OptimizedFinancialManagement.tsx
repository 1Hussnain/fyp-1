import React from "react";
import { useOptimizedFinancial } from "@/hooks/useOptimizedFinancial";
import { useBudgetAnalytics } from "@/hooks/useBudgetAnalytics";
import OptimizedTransactionTable from "@/components/financial/OptimizedTransactionTable";
import OptimizedCategoryChart from "@/components/financial/OptimizedCategoryChart";
import CategoryManagementDialog from "@/components/financial/CategoryManagementDialog";
import FinancialInsightsCard from "@/components/financial/FinancialInsightsCard";
import { Loader2 } from "lucide-react";

const OptimizedFinancialManagement = () => {
  const {
    transactions,
    categories,
    loading,
    summary,
    categorySpending,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch
  } = useOptimizedFinancial();

  const { goals, addGoal, updateGoal, deleteGoal } = useBudgetAnalytics();

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
    // For now, return true - this would need to be implemented
    console.log('Add category:', data);
    return true;
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
            transactions={transactions}
            categories={categories}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <OptimizedCategoryChart
            data={categorySpending}
            onAddCategory={handleAddCategory}
          />
          
          <div className="space-y-6">
            <CategoryManagementDialog 
              onAddCategory={handleAddCategory}
            />
            
            <FinancialInsightsCard 
              totalIncome={summary.totalIncome}
              totalExpenses={summary.totalExpenses}
              netIncome={summary.netIncome}
              transactionCount={summary.transactionCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedFinancialManagement;
