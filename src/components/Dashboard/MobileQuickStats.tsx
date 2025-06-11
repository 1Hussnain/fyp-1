
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useBudget } from "@/hooks/useBudget";

const MobileQuickStats = () => {
  const { income, expenses, savings } = useFinancialSummary();
  const { budgetLimit } = useBudget();
  
  const budgetUsed = (expenses / budgetLimit) * 100;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  const stats = [
    {
      label: "Income",
      value: `$${income.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      label: "Expenses", 
      value: `$${expenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      label: "Savings",
      value: `$${savings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      label: "Budget Used",
      value: `${budgetUsed.toFixed(0)}%`,
      icon: Target,
      color: budgetUsed > 90 ? "text-red-500" : budgetUsed > 75 ? "text-yellow-500" : "text-green-500",
      bgColor: budgetUsed > 90 ? "bg-red-50" : budgetUsed > 75 ? "bg-yellow-50" : "bg-green-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:hidden mb-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} rounded-lg p-3`}
        >
          <div className="flex items-center justify-between mb-1">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <span className="text-xs text-gray-600">{stat.label}</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default MobileQuickStats;
