
import React from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCards from "../components/budget-tracker/SummaryCards";
import CategoryBreakdown from "../components/budget-tracker/CategoryBreakdown";
import TransactionList from "../components/budget-tracker/TransactionList";
import BudgetLimit from "../components/budget-tracker/BudgetLimit";
import { useBudget } from "@/hooks/useBudget";
import { useTransactions } from "@/hooks/useTransactions";
import { Loader2, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const BudgetSummary = () => {
  const { budgetLimit, currentSpent, remaining, overBudget, loading, error, updateBudgetLimit } = useBudget();
  const { transactions, loading: transactionsLoading } = useTransactions();

  if (loading || transactionsLoading) {
    return (
      <AppLayout pageTitle="Budget Summary">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading budget data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout pageTitle="Budget Summary">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Error loading budget data</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Calculate category breakdown from transactions
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.categories?.name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Number(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  const categoryTotalsArray = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    name: category,
    value: amount
  }));

  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const closeToLimit = budgetLimit > 0 && (currentSpent / budgetLimit) >= 0.8 && !overBudget;

  const handleBudgetLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = Number(e.target.value);
    updateBudgetLimit(newLimit);
  };

  // Prepare data for charts
  const pieData = categoryTotalsArray.slice(0, 5);
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Monthly spending trend (last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }).reverse();

  const monthlyData = last6Months.map(month => ({
    month,
    expenses: Math.random() * 2000 + 500, // Mock data - replace with real data
    income: Math.random() * 3000 + 1000
  }));

  return (
    <AppLayout pageTitle="Budget Summary">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-green-900">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center py-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Budget Overview & Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Monitor your spending and stay within your budget limits
              </p>
            </div>

            {/* Summary Cards */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <SummaryCards
                  income={totalIncome}
                  expenses={totalExpenses}
                  remaining={remaining}
                  overBudget={overBudget}
                  closeToLimit={closeToLimit}
                />
              </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Pie Chart */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trend Chart */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Monthly Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                        <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
                        <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Category Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdown
                    categoryTotalsArray={categoryTotalsArray}
                    expenses={totalExpenses}
                  />
                </CardContent>
              </Card>

              {/* Budget Limits */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Budget Limits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BudgetLimit
                    budgetLimit={budgetLimit}
                    onBudgetLimitChange={handleBudgetLimitChange}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList transactions={transactions.slice(0, 10)} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BudgetSummary;
