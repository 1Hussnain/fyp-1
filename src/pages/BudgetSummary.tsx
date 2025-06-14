
import React from "react";
import { motion } from "framer-motion";
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowDown, ArrowUp, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBudgetAnalytics } from "@/hooks/useBudgetAnalytics";
import { useFinancialDataDB } from "@/hooks/useFinancialDataDB";
import { useGoalsDB } from "@/hooks/useGoalsDB";
import SpendingInsights from "@/components/analytics/SpendingInsights";
import GoalProgressSummary from "@/components/analytics/GoalProgressSummary";

const BudgetSummary = () => {
  const { income, expenses, budgetLimit } = useFinancialDataDB();
  const { goals } = useGoalsDB();
  const {
    monthlyTrend,
    categorySpending,
    spendingInsights,
    comparativeMetrics,
    totalSavings,
    savingsRate,
    budgetUtilization
  } = useBudgetAnalytics();

  const overBudget = expenses > budgetLimit;

  // Generate CSV export data
  const handleExportData = () => {
    const csvData = [
      ['Month', 'Income', 'Expenses', 'Savings'],
      ...monthlyTrend.map(item => [item.month, item.income, item.expense, item.savings])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget-summary.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <h1 className="text-2xl font-bold">📊 Budget Summary & Analytics</h1>
        
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline" className="flex items-center" onClick={handleExportData}>
            <Download size={16} className="mr-1" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <SummaryCard 
          title="Total Income"
          value={`$${income.toLocaleString()}`}
          icon={<ArrowUp className="text-green-600" />}
          color="bg-green-50 border-green-200"
          textColor="text-green-700"
        />
        
        <SummaryCard 
          title="Total Expenses"
          value={`$${expenses.toLocaleString()}`}
          icon={<ArrowDown className="text-red-600" />}
          color="bg-red-50 border-red-200"
          textColor="text-red-700"
        />
        
        <SummaryCard 
          title="Net Savings"
          value={`$${totalSavings.toLocaleString()}`}
          subtitle={`${savingsRate.toFixed(1)}% rate`}
          icon={<Info className="text-blue-600" />}
          color="bg-blue-50 border-blue-200"
          textColor="text-blue-700"
        />

        <SummaryCard 
          title="Budget Usage"
          value={`${budgetUtilization.toFixed(1)}%`}
          subtitle={overBudget ? 'Over Budget' : 'Within Budget'}
          icon={<Info className={overBudget ? "text-red-600" : "text-green-600"} />}
          color={overBudget ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}
          textColor={overBudget ? "text-red-700" : "text-green-700"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart: Expense Categories */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
            {categorySpending.length > 0 ? (
              <ChartContainer className="h-[300px]" config={{
                expenses: { label: "Expenses" },
              }}>
                <PieChart>
                  <Pie
                    data={categorySpending}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="name"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No expense data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart: Income vs Expenses Trend */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Income vs Expenses Trend</h2>
            {monthlyTrend.length > 0 ? (
              <ChartContainer className="h-[300px]" config={{
                income: { label: "Income", color: "#4ade80" },
                expense: { label: "Expenses", color: "#f87171" },
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyTrend}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#4ade80" />
                    <Bar dataKey="expense" name="Expenses" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No transaction history available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
            <h2 className="text-lg font-semibold">Budget vs Actual Spending</h2>
            <p className="text-sm text-gray-500">Budget Limit: ${budgetLimit.toLocaleString()}</p>
          </div>
          
          <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden">
            <div 
              className={`h-full ${overBudget ? 'bg-red-500' : 'bg-blue-500'}`} 
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-500">0%</p>
            <p className={`text-sm ${overBudget ? 'text-red-500 font-medium' : 'text-blue-500'}`}>
              {budgetUtilization.toFixed(1)}% {overBudget ? '(Over Budget)' : 'of Budget Used'}
            </p>
            <p className="text-sm text-gray-500">100%</p>
          </div>
          
          {overBudget && (
            <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-600">
                ⚠️ You've exceeded your budget by ${(expenses - budgetLimit).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals Progress Summary */}
      <div className="mb-8">
        <GoalProgressSummary goals={goals} />
      </div>

      {/* Spending Insights */}
      <SpendingInsights 
        insights={spendingInsights}
        comparativeMetrics={comparativeMetrics}
      />
    </div>
  );
};

// Summary Card Component
interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, icon, color, textColor }) => {
  return (
    <Card className={`border ${color}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <span className="p-2 rounded-full bg-white border">{icon}</span>
        </div>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
