
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowDown, ArrowUp, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dummy data
const budgetData = {
  month: "April 2025",
  income: 120000,
  expenses: 95000,
  budgetLimit: 90000,
  categories: [
    { name: "Rent", amount: 40000, fill: "#8884d8" },
    { name: "Groceries", amount: 15000, fill: "#82ca9d" },
    { name: "Transport", amount: 8000, fill: "#ffc658" },
    { name: "Dining", amount: 12000, fill: "#ff8042" },
    { name: "Utilities", amount: 10000, fill: "#0088fe" },
    { name: "Other", amount: 10000, fill: "#00C49F" },
  ],
  monthlyTrend: [
    { month: "Jan", income: 100000, expense: 85000 },
    { month: "Feb", income: 110000, expense: 92000 },
    { month: "Mar", income: 105000, expense: 88000 },
    { month: "Apr", income: 120000, expense: 95000 },
  ]
};

const BudgetSummary = () => {
  const [selectedMonth, setSelectedMonth] = useState("April 2025");
  
  // Calculate savings
  const savings = budgetData.income - budgetData.expenses;
  const savingsPercentage = Math.round((savings / budgetData.income) * 100);
  
  // Calculate budget progress
  const budgetPercentage = Math.round((budgetData.expenses / budgetData.budgetLimit) * 100);
  const overBudget = budgetData.expenses > budgetData.budgetLimit;
  
  // Get recommendations based on spending patterns
  const getRecommendations = () => {
    const tips = [];
    
    if (overBudget) {
      tips.push("⚠️ You've exceeded your budget by ₹" + (budgetData.expenses - budgetData.budgetLimit).toLocaleString() + ". Consider cutting back on non-essential expenses.");
    }
    
    const dining = budgetData.categories.find(c => c.name === "Dining");
    if (dining && dining.amount > 10000) {
      tips.push("🍽️ Your dining expenses are high. Try meal prepping or cooking at home more often to save money.");
    }
    
    if (savings < budgetData.income * 0.2) {
      tips.push("💰 Your savings rate is below 20%. Try to increase your savings to build a stronger financial foundation.");
    }
    
    const largestCategory = [...budgetData.categories].sort((a, b) => b.amount - a.amount)[0];
    tips.push(`📊 Your largest expense category is ${largestCategory.name} at ₹${largestCategory.amount.toLocaleString()}, which is ${Math.round((largestCategory.amount / budgetData.expenses) * 100)}% of your total expenses.`);
    
    return tips;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <h1 className="text-2xl font-bold">📊 Budget Summary</h1>
        
        <div className="flex items-center space-x-3">
          <select 
            className="p-2 border rounded-lg text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="April 2025">April 2025</option>
            <option value="March 2025">March 2025</option>
            <option value="February 2025">February 2025</option>
            <option value="January 2025">January 2025</option>
          </select>
          
          <Button size="sm" variant="outline" className="flex items-center">
            <Download size={16} className="mr-1" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard 
          title="Total Income"
          value={`₹${budgetData.income.toLocaleString()}`}
          icon={<ArrowUp className="text-green-600" />}
          color="bg-green-50 border-green-200"
          textColor="text-green-700"
        />
        
        <SummaryCard 
          title="Total Expenses"
          value={`₹${budgetData.expenses.toLocaleString()}`}
          icon={<ArrowDown className="text-red-600" />}
          color="bg-red-50 border-red-200"
          textColor="text-red-700"
        />
        
        <SummaryCard 
          title="Savings"
          value={`₹${savings.toLocaleString()} (${savingsPercentage}%)`}
          icon={<Info className="text-blue-600" />}
          color="bg-blue-50 border-blue-200"
          textColor="text-blue-700"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart: Expense Categories */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
            <ChartContainer className="h-[300px]" config={{
              expenses: { label: "Expenses" },
            }}>
              <PieChart>
                <Pie
                  data={budgetData.categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {budgetData.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Income vs Expenses */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Income vs Expenses Trend</h2>
            <ChartContainer className="h-[300px]" config={{
              income: { label: "Income", color: "#4ade80" },
              expense: { label: "Expenses", color: "#f87171" },
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={budgetData.monthlyTrend}
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
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
            <h2 className="text-lg font-semibold">Budget vs Actual Spending</h2>
            <p className="text-sm text-gray-500">Budget Limit: ₹{budgetData.budgetLimit.toLocaleString()}</p>
          </div>
          
          <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden">
            <div 
              className={`h-full ${overBudget ? 'bg-red-500' : 'bg-blue-500'}`} 
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-500">0%</p>
            <p className={`text-sm ${overBudget ? 'text-red-500 font-medium' : 'text-blue-500'}`}>
              {budgetPercentage}% {overBudget ? '(Over Budget)' : 'of Budget Used'}
            </p>
            <p className="text-sm text-gray-500">100%</p>
          </div>
          
          {overBudget && (
            <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-600">
                ⚠️ You've exceeded your budget by ₹{(budgetData.expenses - budgetData.budgetLimit).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">💡 Smart Recommendations</h2>
          <ul className="space-y-3">
            {getRecommendations().map((tip, idx) => (
              <li key={idx} className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

// Summary Card Component
interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color, textColor }) => {
  return (
    <Card className={`border ${color}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <span className="p-2 rounded-full bg-white border">{icon}</span>
        </div>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
