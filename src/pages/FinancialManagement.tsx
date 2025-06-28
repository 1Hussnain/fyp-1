
import React from "react";
import { motion } from "framer-motion";
import { useFinancialDataDB } from "@/hooks/useFinancialDataDB";
import BudgetLimit from "@/components/budget-tracker/BudgetLimit";
import SummaryCards from "@/components/budget-tracker/SummaryCards";
import UnifiedTransactionForm from "@/components/financial/UnifiedTransactionForm";
import CategoryBreakdown from "@/components/budget-tracker/CategoryBreakdown";
import TransactionFilter from "@/components/financial/TransactionFilter";
import TransactionHistory from "@/components/financial/TransactionHistory";
import DataMigration from "@/components/DataMigration";
import { Loader2 } from "lucide-react";

const FinancialManagement = () => {
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

  // Updated: add explicit typing for importedData to avoid type errors
  const handleBulkImportWrapper = async (importedData: any[]) => {
    const convertedTransactions = importedData.map((item: any) => ({
      type: (item.type || 'expense') as 'income' | 'expense',
      category_id: item.category_id || null,
      amount: item.amount || 0,
      description: item.description || null,
      date: item.date || new Date().toISOString().split('T')[0],
      user_id: item.user_id || '',
      categories: item.categories || { name: 'Uncategorized' }
    }));

    await handleBulkImport(convertedTransactions);
  };

  const handleAddRecurringWrapper = async (recurringData: any) => {
    await handleAddRecurring(recurringData, "monthly", 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
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
              onBulkImport={handleBulkImportWrapper}
              onAddRecurring={handleAddRecurringWrapper}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinancialManagement;
