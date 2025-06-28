
import React from "react";
import { motion } from "framer-motion";
import { useFinancialDataDB } from "@/hooks/useFinancialDataDB";
import { usePerformanceOptimized } from "@/hooks/usePerformanceOptimized";
import BudgetLimit from "@/components/budget-tracker/BudgetLimit";
import SummaryCards from "@/components/budget-tracker/SummaryCards";
import UnifiedTransactionForm from "@/components/financial/UnifiedTransactionForm";
import CategoryBreakdown from "@/components/budget-tracker/CategoryBreakdown";
import TransactionFilter from "@/components/financial/TransactionFilter";
import TransactionHistory from "@/components/financial/TransactionHistory";
import DataMigration from "@/components/DataMigration";
import FastLoadingSpinner from "@/components/ui/FastLoadingSpinner";

const FinancialManagement = () => {
  usePerformanceOptimized('FinancialManagement');
  
  const {
    transactions,
    allTransactions,
    income,
    expenses,
    budgetLimit,
    remaining,
    overBudget,
    closeToLimit,
    categoryTotalsArray,
    filter,
    loading,
    handleBudgetLimitChange,
    handleAddTransaction,
    handleEditTransaction,
    handleDeleteTransaction,
    handleBulkImport,
    handleAddRecurring,
    handleFilterChange,
    handleResetFilters
  } = useFinancialDataDB();

  // Improved loading state with better UX
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FastLoadingSpinner size="lg" text="Loading your financial data..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <DataMigration />

      {/* Budget Limit Setting */}
      <BudgetLimit 
        budgetLimit={budgetLimit}
        onBudgetLimitChange={handleBudgetLimitChange}
      />

      {/* Summary Cards */}
      <SummaryCards
        income={income}
        expenses={expenses}
        remaining={remaining}
        overBudget={overBudget}
        closeToLimit={closeToLimit}
      />

      {/* Overview Content */}
      <div className="space-y-6">
        <UnifiedTransactionForm onAddTransaction={handleAddTransaction} />
        
        <div className="grid lg:grid-cols-2 gap-8">
          <CategoryBreakdown 
            categoryTotalsArray={categoryTotalsArray}
            expenses={expenses}
          />
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Transaction Management</h3>
            
            <TransactionFilter
              filter={filter}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
            
            <TransactionHistory 
              transactions={transactions.map(t => ({
                ...t,
                type: t.type as 'income' | 'expense',
                category: t.categories?.name || 'Uncategorized'
              }))}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onBulkImport={handleBulkImport}
              onAddRecurring={handleAddRecurring}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinancialManagement;
