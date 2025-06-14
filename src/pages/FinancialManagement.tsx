
import React from "react";
import { motion } from "framer-motion";
import { useFinancialDataDB } from "@/hooks/useFinancialDataDB";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BudgetLimit from "@/components/budget-tracker/BudgetLimit";
import SummaryCards from "@/components/budget-tracker/SummaryCards";
import UnifiedTransactionForm from "@/components/financial/UnifiedTransactionForm";
import TransactionTabs from "@/components/income-expenses/TransactionTabs";
import CategoryBreakdown from "@/components/budget-tracker/CategoryBreakdown";
import TransactionFilter from "@/components/financial/TransactionFilter";
import TransactionHistory from "@/components/financial/TransactionHistory";
import TransactionList from "@/components/budget-tracker/TransactionList";
import DataMigration from "@/components/DataMigration";
import { Loader2 } from "lucide-react";

const FinancialManagement = () => {
  const {
    transactions,
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

  const [activeTab, setActiveTab] = React.useState<"income" | "expense">("income");
  const [incomeForm, setIncomeForm] = React.useState({ source: "", amount: "" });
  const [expenseForm, setExpenseForm] = React.useState({ category: "", amount: "" });

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIncomeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIncome = async () => {
    const amount = parseFloat(incomeForm.amount);
    if (incomeForm.source && !isNaN(amount) && amount > 0) {
      await handleAddTransaction(incomeForm.source, amount, "income");
      setIncomeForm({ source: "", amount: "" });
    }
  };

  const handleAddExpense = async () => {
    const amount = parseFloat(expenseForm.amount);
    if (expenseForm.category && !isNaN(amount) && amount > 0) {
      await handleAddTransaction(expenseForm.category, amount, "expense");
      setExpenseForm({ category: "", amount: "" });
    }
  };

  // Simple bulk import handler that converts the data format
  const handleBulkImportWrapper = async (importedData: any[]) => {
    // Convert the incoming data to the expected format with category object
    const convertedTransactions = importedData.map(item => ({
      type: item.type || 'expense',
      category_id: item.category_id || null,
      amount: item.amount || 0,
      description: item.description || null,
      date: item.date || new Date().toISOString().split('T')[0],
      user_id: item.user_id || '',
      category: item.category || null // Add the category object property
    }));
    
    await handleBulkImport(convertedTransactions);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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

        {/* Tabbed Interface for Different Views */}
        <Tabs defaultValue="unified" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unified">Unified Entry</TabsTrigger>
            <TabsTrigger value="separate">Income & Expenses</TabsTrigger>
            <TabsTrigger value="analysis">Analysis & History</TabsTrigger>
          </TabsList>

          {/* Unified Transaction Form Tab */}
          <TabsContent value="unified" className="space-y-6">
            <UnifiedTransactionForm onAddTransaction={handleAddTransaction} />
            
            <div className="grid lg:grid-cols-2 gap-8">
              <CategoryBreakdown 
                categoryTotalsArray={categoryTotalsArray}
                expenses={expenses}
              />
              <TransactionList transactions={transactions.slice(0, 10)} />
            </div>
          </TabsContent>

          {/* Income & Expenses Tab */}
          <TabsContent value="separate" className="space-y-6">
            <TransactionTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              incomeForm={incomeForm}
              expenseForm={expenseForm}
              handleIncomeChange={handleIncomeChange}
              handleExpenseChange={handleExpenseChange}
              handleAddIncome={handleAddIncome}
              handleAddExpense={handleAddExpense}
            />
            
            <div className="grid lg:grid-cols-2 gap-8">
              <CategoryBreakdown 
                categoryTotalsArray={categoryTotalsArray}
                expenses={expenses}
              />
              <TransactionList transactions={transactions.slice(0, 10)} />
            </div>
          </TabsContent>

          {/* Analysis & History Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <CategoryBreakdown 
                categoryTotalsArray={categoryTotalsArray}
                expenses={expenses}
              />

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Transaction Management</h3>
                
                <TransactionFilter
                  filter={filter}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                />
                
                <TransactionHistory 
                  transactions={transactions}
                  onEditTransaction={handleEditTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onBulkImport={handleBulkImportWrapper}
                  onAddRecurring={handleAddRecurring}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default FinancialManagement;
