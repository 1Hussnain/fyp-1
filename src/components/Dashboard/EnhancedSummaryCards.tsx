
import React from "react";
import { motion } from "framer-motion";
import { Wallet, CreditCard, PiggyBank, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useFinancialDataDB } from "@/hooks/useFinancialDataDB";
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
  const { income, expenses, budgetLimit } = useFinancialDataDB();
  const { goals } = useGoalsDB();

  const savings = income - expenses;
  const budgetRemaining = budgetLimit - expenses;
  const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalGoalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);

  const cards = [
    { 
      title: "Monthly Income", 
      amount: `$${income.toLocaleString()}`, 
      icon: Wallet, 
      color: "text-green-500",
      bgColor: "bg-green-50",
      trend: "+5.2%",
      isPositive: true
    },
    { 
      title: "Monthly Expenses", 
      amount: `$${expenses.toLocaleString()}`, 
      icon: CreditCard, 
      color: "text-red-500",
      bgColor: "bg-red-50",
      trend: "-2.1%",
      isPositive: true
    },
    { 
      title: "Net Savings", 
      amount: `$${savings.toLocaleString()}`, 
      icon: PiggyBank, 
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      trend: `${savings > 0 ? '+' : ''}${((savings / income) * 100).toFixed(1)}%`,
      isPositive: savings > 0
    },
    { 
      title: "Budget Remaining", 
      amount: `$${budgetRemaining.toLocaleString()}`, 
      icon: Calendar, 
      color: budgetRemaining < 0 ? "text-red-500" : "text-orange-500",
      bgColor: budgetRemaining < 0 ? "bg-red-50" : "bg-orange-50",
      trend: `${((budgetRemaining / budgetLimit) * 100).toFixed(1)}%`,
      isPositive: budgetRemaining > 0
    }
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`${card.bgColor} p-6 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`rounded-lg p-3 ${card.color} bg-white bg-opacity-50`}>
              <card.icon size={24} className={card.color} />
            </div>
            <div className="flex items-center gap-1 text-sm">
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
            <p className="text-sm text-gray-600 mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-gray-800">{card.amount}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EnhancedSummaryCards;
