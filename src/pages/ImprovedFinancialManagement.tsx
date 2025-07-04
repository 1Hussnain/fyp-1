
import React from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OptimizedTransactionForm from "../components/financial/OptimizedTransactionForm";
import OptimizedTransactionList from "../components/financial/OptimizedTransactionList";
import OptimizedCategoryList from "../components/financial/OptimizedCategoryList";
import FinancialInsightsCard from "../components/financial/FinancialInsightsCard";
import { useOptimizedFinancial } from "@/hooks/useOptimizedFinancial";
import { Loader2 } from "lucide-react";

const ImprovedFinancialManagement = () => {
  const {
    transactions,
    categories,
    summary,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory
  } = useOptimizedFinancial();

  // Loading state
  if (loading) {
    return (
      <AppLayout pageTitle="Financial Management">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading financial data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Mock handlers for category operations (to be implemented)
  const handleRefreshCategories = () => {
    // Refresh categories logic
  };

  const handleEditCategory = (category: any) => {
    // Edit category logic
  };

  const handleDeleteCategory = async (category: any) => {
    // Delete category logic
  };

  const handleBudgetChange = async (category: any, value: string) => {
    // Budget change logic
  };

  return (
    <AppLayout pageTitle="Financial Management">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Financial Insights Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <FinancialInsightsCard />
              </div>
            </div>

            {/* Main Content Tabs */}
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Manage Your Finances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="transactions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <TabsTrigger 
                      value="transactions" 
                      className="rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Transactions
                    </TabsTrigger>
                    <TabsTrigger 
                      value="add-transaction"
                      className="rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Add Transaction
                    </TabsTrigger>
                    <TabsTrigger 
                      value="categories"
                      className="rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Categories
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="transactions" className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                      <OptimizedTransactionList 
                        transactions={transactions}
                        categories={categories}
                        onUpdateTransaction={updateTransaction}
                        onDeleteTransaction={deleteTransaction}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="add-transaction" className="space-y-6">
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                        <OptimizedTransactionForm 
                          categories={categories}
                          onAddTransaction={addTransaction}
                          onAddCategory={addCategory}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="categories" className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                      <OptimizedCategoryList 
                        categories={categories}
                        onRefresh={handleRefreshCategories}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                        onBudgetChange={handleBudgetChange}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ImprovedFinancialManagement;
