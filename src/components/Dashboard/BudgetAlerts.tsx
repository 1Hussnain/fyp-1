
import React, { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useFinancialDataDB } from "@/hooks/useFinancialDataDB";
import { useToast } from "@/hooks/use-toast";

const BudgetAlerts = () => {
  const { expenses, budgetLimit, income } = useFinancialDataDB();
  const { toast } = useToast();

  const budgetUtilization = (expenses / budgetLimit) * 100;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  useEffect(() => {
    // Show toast notifications for critical alerts
    if (budgetUtilization > 100) {
      toast({
        title: "Budget Exceeded!",
        description: `You've spent $${(expenses - budgetLimit).toFixed(2)} over your budget limit.`,
        variant: "destructive",
      });
    } else if (budgetUtilization > 90) {
      toast({
        title: "Budget Alert",
        description: `You're at ${budgetUtilization.toFixed(1)}% of your budget limit.`,
      });
    }
  }, [budgetUtilization, expenses, budgetLimit, toast]);

  const getAlerts = () => {
    const alerts = [];

    // Budget alerts
    if (budgetUtilization > 100) {
      alerts.push({
        type: "error" as const,
        title: "Budget Exceeded",
        message: `You've exceeded your budget by $${(expenses - budgetLimit).toFixed(2)}. Consider reducing discretionary spending.`,
        icon: AlertTriangle,
      });
    } else if (budgetUtilization > 90) {
      alerts.push({
        type: "warning" as const,
        title: "Approaching Budget Limit",
        message: `You've used ${budgetUtilization.toFixed(1)}% of your monthly budget. Only $${(budgetLimit - expenses).toFixed(2)} remaining.`,
        icon: AlertTriangle,
      });
    } else if (budgetUtilization > 75) {
      alerts.push({
        type: "info" as const,
        title: "Budget Update",
        message: `You've used ${budgetUtilization.toFixed(1)}% of your budget. You're on track for the month.`,
        icon: Info,
      });
    }

    // Savings rate alerts
    if (savingsRate < 10) {
      alerts.push({
        type: "warning" as const,
        title: "Low Savings Rate",
        message: `Your current savings rate is ${savingsRate.toFixed(1)}%. Consider increasing savings to at least 20%.`,
        icon: AlertTriangle,
      });
    } else if (savingsRate >= 20) {
      alerts.push({
        type: "success" as const,
        title: "Great Savings Rate",
        message: `Excellent! Your savings rate of ${savingsRate.toFixed(1)}% exceeds the recommended 20%.`,
        icon: CheckCircle,
      });
    }

    return alerts;
  };

  const alerts = getAlerts();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert, index) => (
        <Alert 
          key={index} 
          variant={alert.type === "error" ? "destructive" : "default"}
          className={`${
            alert.type === "success" ? "border-green-200 bg-green-50" :
            alert.type === "warning" ? "border-yellow-200 bg-yellow-50" :
            alert.type === "info" ? "border-blue-200 bg-blue-50" : ""
          }`}
        >
          <alert.icon className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">{alert.title}:</span> {alert.message}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default BudgetAlerts;
