
import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useBudget } from "@/hooks/useBudget";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const budgetChartConfig = {
  budget: {
    label: "Budget",
    color: "#3b82f6",
  },
  actual: {
    label: "Actual",
    color: "#10b981",
  },
};

const categoryChartConfig = {
  amount: {
    label: "Amount",
    color: "#8884d8",
  },
};

const BudgetChart = () => {
  // Patch: Use correct fields from summary
  const { totalExpenses, transactions } = useFinancialSummary();

  // Compute categoryTotalsArray manually
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const category = t.categories?.name || "Uncategorized";
      categoryTotals[category] = (categoryTotals[category] || 0) + Number(t.amount);
    });
  const categoryTotalsArray = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const { budgetLimit, loading, overBudget } = useBudget();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800">Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const budgetData = [
    {
      name: 'This Month',
      budget: budgetLimit,
      actual: totalExpenses,
    }
  ];

  const topCategories = categoryTotalsArray.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Budget Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {overBudget && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                You're over budget this month! Consider reviewing your spending.
              </AlertDescription>
            </Alert>
          )}

          {totalExpenses === 0 && budgetLimit === 0 ? (
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center flex-col">
              <p className="text-gray-500 mb-2 font-medium">No budget or spending data yet</p>
              <p className="text-sm text-gray-400">Set your budget and add transactions to see charts</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget vs Actual Bar Chart */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Monthly Budget vs Actual</h4>
                <ChartContainer config={budgetChartConfig} className="h-48 w-full">
                  <BarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Bar dataKey="budget" fill="var(--color-budget)" name="Budget" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill={overBudget ? "#ef4444" : "var(--color-actual)"} name="Actual" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>

              {/* Category Breakdown Pie Chart */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Spending by Category</h4>
                {topCategories.length > 0 ? (
                  <ChartContainer config={categoryChartConfig} className="h-48 w-full">
                    <PieChart>
                      <Pie
                        data={topCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, amount }) => amount > 0 ? `${category}: $${amount.toFixed(0)}` : ''}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {topCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                      />
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500 text-sm font-medium">No expense categories yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BudgetChart;
