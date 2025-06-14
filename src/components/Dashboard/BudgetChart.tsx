
import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useBudget } from "@/hooks/useBudget";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];

const BudgetChart = () => {
  const { expenses, categoryTotalsArray } = useFinancialSummary();
  const { budgetLimit, loading, overBudget } = useBudget();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white p-6 rounded-xl shadow mt-6"
      >
        <h3 className="text-lg font-semibold mb-4">Budget vs. Actual Spending</h3>
        <Skeleton className="h-64 w-full" />
      </motion.div>
    );
  }

  const budgetData = [
    {
      name: 'Budget vs Actual',
      budget: budgetLimit,
      actual: expenses,
    }
  ];

  const topCategories = categoryTotalsArray.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="bg-white p-6 rounded-xl shadow mt-6"
    >
      <h3 className="text-lg font-semibold mb-4">Budget vs. Actual Spending</h3>
      
      {overBudget && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You're over budget this month! Consider reviewing your spending.
          </AlertDescription>
        </Alert>
      )}
      
      {expenses === 0 && budgetLimit === 0 ? (
        <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center flex-col">
          <p className="text-gray-500 mb-2">No budget or spending data yet</p>
          <p className="text-xs text-gray-400">Set your budget and add transactions to see charts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget vs Actual Bar Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Monthly Budget Overview</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                <Bar dataKey="actual" fill={overBudget ? "#ff4444" : "#82ca9d"} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown Pie Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Spending by Category</h4>
            {topCategories.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, amount }) => `${category}: $${amount.toFixed(0)}`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500 text-sm">No expense categories yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BudgetChart;
