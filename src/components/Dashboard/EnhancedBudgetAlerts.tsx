
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from "lucide-react";
import { useFinancialDataDB } from "@/hooks/useFinancialDataDB";
import { useNotifications } from "@/hooks/useNotifications";

const EnhancedBudgetAlerts = () => {
  const { expenses, budgetLimit, income } = useFinancialDataDB();
  const { addNotification } = useNotifications();

  const budgetUtilization = (expenses / budgetLimit) * 100;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  useEffect(() => {
    // Send notifications for critical budget alerts
    if (budgetUtilization > 100) {
      addNotification({
        type: 'error',
        title: 'Budget Exceeded!',
        message: `You've spent $${(expenses - budgetLimit).toFixed(2)} over your budget limit.`,
        persistent: true
      });
    } else if (budgetUtilization > 90) {
      addNotification({
        type: 'warning',
        title: 'Budget Alert',
        message: `You're at ${budgetUtilization.toFixed(1)}% of your budget limit.`
      });
    }

    // Savings rate notifications
    if (savingsRate < 10 && income > 0) {
      addNotification({
        type: 'warning',
        title: 'Low Savings Rate',
        message: `Your current savings rate is ${savingsRate.toFixed(1)}%. Consider increasing savings.`
      });
    } else if (savingsRate >= 20) {
      addNotification({
        type: 'success',
        title: 'Great Savings Rate',
        message: `Excellent! Your savings rate of ${savingsRate.toFixed(1)}% exceeds the recommended 20%.`
      });
    }
  }, [budgetUtilization, expenses, budgetLimit, savingsRate, income, addNotification]);

  const getAlerts = () => {
    const alerts = [];

    // Budget alerts
    if (budgetUtilization > 100) {
      alerts.push({
        type: "error" as const,
        title: "Budget Exceeded",
        message: `You've exceeded your budget by $${(expenses - budgetLimit).toFixed(2)}. Consider reducing discretionary spending.`,
        icon: AlertTriangle,
        trend: `+${((expenses - budgetLimit) / budgetLimit * 100).toFixed(1)}%`,
        trendIcon: TrendingUp,
        trendColor: "text-red-500"
      });
    } else if (budgetUtilization > 90) {
      alerts.push({
        type: "warning" as const,
        title: "Approaching Budget Limit",
        message: `You've used ${budgetUtilization.toFixed(1)}% of your monthly budget. Only $${(budgetLimit - expenses).toFixed(2)} remaining.`,
        icon: AlertTriangle,
        trend: `${budgetUtilization.toFixed(1)}%`,
        trendIcon: TrendingUp,
        trendColor: "text-yellow-500"
      });
    } else if (budgetUtilization > 75) {
      alerts.push({
        type: "info" as const,
        title: "Budget Update",
        message: `You've used ${budgetUtilization.toFixed(1)}% of your budget. You're on track for the month.`,
        icon: Info,
        trend: `${budgetUtilization.toFixed(1)}%`,
        trendIcon: TrendingUp,
        trendColor: "text-blue-500"
      });
    }

    // Savings rate alerts
    if (savingsRate >= 20) {
      alerts.push({
        type: "success" as const,
        title: "Excellent Savings",
        message: `Your savings rate of ${savingsRate.toFixed(1)}% is outstanding! Keep up the great work.`,
        icon: CheckCircle,
        trend: `${savingsRate.toFixed(1)}%`,
        trendIcon: TrendingUp,
        trendColor: "text-green-500"
      });
    }

    return alerts;
  };

  const alerts = getAlerts();

  if (alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="font-medium text-green-800">All systems green!</span>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>On track</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 mb-6"
    >
      {alerts.map((alert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Alert 
            variant={alert.type === "error" ? "destructive" : "default"}
            className={`${
              alert.type === "success" ? "border-green-200 bg-green-50" :
              alert.type === "warning" ? "border-yellow-200 bg-yellow-50" :
              alert.type === "info" ? "border-blue-200 bg-blue-50" : ""
            }`}
          >
            <alert.icon className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{alert.title}:</span> {alert.message}
                </div>
                <div className={`flex items-center gap-1 text-sm ${alert.trendColor}`}>
                  <alert.trendIcon className="h-3 w-3" />
                  <span>{alert.trend}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EnhancedBudgetAlerts;
