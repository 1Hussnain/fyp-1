
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react";

const EnhancedSummaryCards = () => {
  const { transactions } = useTransactions();
  const { goals } = useGoals();

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const activeGoals = goals.filter(g => !g.is_completed);
  const totalGoalProgress = goals.length > 0 
    ? goals.reduce((sum, g) => sum + ((Number(g.saved_amount) / Number(g.target_amount)) * 100), 0) / goals.length
    : 0;

  const cards = [
    {
      title: "Total Income",
      value: `$${totalIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "Net Balance",
      value: `$${(totalIncome - totalExpenses).toFixed(2)}`,
      icon: DollarSign,
      color: totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600",
      bgColor: totalIncome - totalExpenses >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "Goals Progress",
      value: `${totalGoalProgress.toFixed(1)}%`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
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
  );
};

export default EnhancedSummaryCards;
