import React from "react";
import { motion } from "framer-motion";
import { useOptimizedFinancial } from "@/hooks/useOptimizedFinancial";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";
import OptimizedTransactionForm from "@/components/financial/OptimizedTransactionForm";
import OptimizedTransactionList from "@/components/financial/OptimizedTransactionList";
import OptimizedCategoryChart from "@/components/financial/OptimizedCategoryChart";
const OptimizedFinancialManagement = () => {
  const {
    transactions,
    categories,
    summary,
    categorySpending,
    income,
    expenses,
    netIncome,
    transactionCount,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory
  } = useOptimizedFinancial();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your financial data...</p>
        </div>
      </div>;
  }
  return <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${income.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${expenses.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <DollarSign className={`h-4 w-4 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{transactionCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <OptimizedTransactionForm categories={categories} onAddTransaction={addTransaction} onAddCategory={addCategory} />
              <OptimizedCategoryChart data={categorySpending} />
            </div>
            
            <OptimizedTransactionList transactions={transactions.slice(0, 10)} categories={categories} onUpdateTransaction={updateTransaction} onDeleteTransaction={deleteTransaction} title="Recent Transactions" />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <OptimizedTransactionForm categories={categories} onAddTransaction={addTransaction} onAddCategory={addCategory} />
              </div>
              <div className="lg:col-span-2">
                <OptimizedTransactionList transactions={transactions} categories={categories} onUpdateTransaction={updateTransaction} onDeleteTransaction={deleteTransaction} title="All Transactions" showPagination={true} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <OptimizedCategoryChart data={categorySpending} />
              <Card>
                <CardHeader>
                  <CardTitle>Financial Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Spending Analysis</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Your top spending category is {categorySpending[0]?.category || 'N/A'} 
                        {categorySpending[0] && ` with $${categorySpending[0].amount.toFixed(2)}`}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-medium text-green-900 dark:text-green-100">Savings Rate</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        You're saving {income > 0 ? (netIncome / income * 100).toFixed(1) : 0}% of your income this month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>;
};
export default OptimizedFinancialManagement;