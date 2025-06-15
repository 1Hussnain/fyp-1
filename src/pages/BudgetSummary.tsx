
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useFinancialInsights } from "@/hooks/useFinancialInsights";
import { useGoals } from "@/hooks/useGoals";
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BudgetSummary = () => {
  const { totalIncome, totalExpenses, netIncome, loading } = useFinancialSummary();
  const { monthlyIncome, monthlyExpenses, topSpendingCategories } = useFinancialInsights();
  const { goals } = useGoals();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center">Loading budget summary...</div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Monthly Income",
      value: `$${monthlyIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Monthly Expenses",
      value: `$${monthlyExpenses.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Net Savings",
      value: `$${(monthlyIncome - monthlyExpenses).toFixed(2)}`,
      icon: DollarSign,
      color: monthlyIncome - monthlyExpenses >= 0 ? "text-green-600" : "text-red-600",
      bgColor: monthlyIncome - monthlyExpenses >= 0 ? "bg-green-50" : "bg-red-50"
    },
    {
      title: "Active Goals",
      value: goals.filter(g => !g.is_completed).length.toString(),
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  const chartData = topSpendingCategories.map(([name, amount]) => ({
    name,
    value: amount
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Budget Summary</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Spending Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No spending data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Income vs Expenses</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Income</span>
                    <span className="font-medium text-green-600">${monthlyIncome.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expenses</span>
                    <span className="font-medium text-red-600">${monthlyExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Net</span>
                    <span className={`font-bold ${
                      monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${(monthlyIncome - monthlyExpenses).toFixed(2)}
                    </span>
                  </div>
                </div>

                {monthlyIncome > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">Savings Rate</div>
                    <div className="text-lg font-bold text-blue-600">
                      {((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetSummary;
