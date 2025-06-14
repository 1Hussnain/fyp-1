
import React from "react";
import { motion } from "framer-motion";
import { Wallet, CreditCard, PiggyBank, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useBudget } from "@/hooks/useBudget";
import { useGoalsDB } from "@/hooks/useGoalsDB";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const EnhancedSummaryCards = () => {
  const { income, expenses, savings } = useFinancialSummary();
  const { budgetLimit, currentSpent } = useBudget();
  const { goals } = useGoalsDB();

  const budgetRemaining = budgetLimit - currentSpent;

  const cards = [
    { 
      title: "Monthly Income", 
      amount: `$${income.toLocaleString()}`, 
      icon: Wallet, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      trend: "+5.2%",
      isPositive: true
    },
    { 
      title: "Monthly Expenses", 
      amount: `$${expenses.toLocaleString()}`, 
      icon: CreditCard, 
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      trend: "-2.1%",
      isPositive: true
    },
    { 
      title: "Net Savings", 
      amount: `$${savings.toLocaleString()}`, 
      icon: PiggyBank, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      trend: `${savings > 0 ? '+' : ''}${income > 0 ? ((savings / income) * 100).toFixed(1) : '0'}%`,
      isPositive: savings > 0
    },
    { 
      title: "Budget Remaining", 
      amount: `$${budgetRemaining.toLocaleString()}`, 
      icon: Calendar, 
      color: budgetRemaining < 0 ? "text-red-600" : "text-orange-600",
      bgColor: budgetRemaining < 0 ? "bg-red-50" : "bg-orange-50",
      borderColor: budgetRemaining < 0 ? "border-red-200" : "border-orange-200",
      trend: `${((budgetRemaining / budgetLimit) * 100).toFixed(1)}%`,
      isPositive: budgetRemaining > 0
    }
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`${card.bgColor} ${card.borderColor} border p-4 sm:p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md min-h-[120px] flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`rounded-lg p-2 sm:p-3 ${card.color} bg-white bg-opacity-80 shadow-sm`}>
              <card.icon size={20} className={card.color} />
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm">
              {card.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={card.isPositive ? "text-green-600" : "text-red-600"}>
                {card.trend}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">{card.title}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{card.amount}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EnhancedSummaryCards;
