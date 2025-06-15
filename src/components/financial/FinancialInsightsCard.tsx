
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";

interface FinancialInsightsCardProps {
  totalIncome?: number;
  totalExpenses?: number;
  netSavings?: number;
  savingsGoal?: number;
}

const FinancialInsightsCard: React.FC<FinancialInsightsCardProps> = ({
  totalIncome = 0,
  totalExpenses = 0,
  netSavings = 0,
  savingsGoal = 1000
}) => {
  const { transactions } = useTransactions();

  // Calculate insights from transactions if props not provided
  const calculatedIncome = totalIncome || transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const calculatedExpenses = totalExpenses || transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const calculatedSavings = netSavings || (calculatedIncome - calculatedExpenses);
  const savingsProgress = savingsGoal > 0 ? Math.min((calculatedSavings / savingsGoal) * 100, 100) : 0;

  const insights = [
    {
      title: "Monthly Income",
      value: `$${calculatedIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Monthly Expenses",
      value: `$${calculatedExpenses.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-red-600"
    },
    {
      title: "Net Savings",
      value: `$${calculatedSavings.toFixed(2)}`,
      icon: calculatedSavings >= 0 ? Target : AlertTriangle,
      color: calculatedSavings >= 0 ? "text-green-600" : "text-red-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.title} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <insight.icon className={`h-4 w-4 ${insight.color}`} />
              <span className="text-sm font-medium">{insight.title}</span>
            </div>
            <span className={`font-semibold ${insight.color}`}>
              {insight.value}
            </span>
          </div>
        ))}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Savings Goal Progress</span>
            <span className="text-sm text-gray-500">{savingsProgress.toFixed(1)}%</span>
          </div>
          <Progress value={savingsProgress} className="h-2" />
          <div className="text-xs text-gray-500 text-center">
            Goal: ${savingsGoal.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialInsightsCard;
