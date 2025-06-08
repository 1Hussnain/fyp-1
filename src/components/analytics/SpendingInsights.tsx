
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface SpendingInsight {
  type: "warning" | "info" | "success";
  message: string;
  icon: string;
}

interface ComparativeMetrics {
  incomeChange: number;
  expenseChange: number;
  savingsChange: number;
}

interface SpendingInsightsProps {
  insights: SpendingInsight[];
  comparativeMetrics: ComparativeMetrics | null;
}

const SpendingInsights: React.FC<SpendingInsightsProps> = ({ 
  insights, 
  comparativeMetrics 
}) => {
  const getAlertVariant = (type: string) => {
    switch (type) {
      case "warning": return "destructive";
      case "success": return "default";
      default: return "default";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "success": return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>💡 Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <Alert key={index} variant={getAlertVariant(insight.type)}>
                <div className="flex items-start gap-2">
                  {getIcon(insight.type)}
                  <AlertDescription className="flex-1">
                    <span className="mr-2">{insight.icon}</span>
                    {insight.message}
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {comparativeMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>📈 Month-over-Month Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {comparativeMetrics.incomeChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">Income</span>
                </div>
                <p className={`text-lg font-bold ${
                  comparativeMetrics.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {comparativeMetrics.incomeChange >= 0 ? '+' : ''}
                  {comparativeMetrics.incomeChange.toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {comparativeMetrics.expenseChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-sm font-medium">Expenses</span>
                </div>
                <p className={`text-lg font-bold ${
                  comparativeMetrics.expenseChange >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {comparativeMetrics.expenseChange >= 0 ? '+' : ''}
                  {comparativeMetrics.expenseChange.toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {comparativeMetrics.savingsChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">Net Savings</span>
                </div>
                <p className={`text-lg font-bold ${
                  comparativeMetrics.savingsChange >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {comparativeMetrics.savingsChange >= 0 ? '+' : ''}
                  ${Math.abs(comparativeMetrics.savingsChange).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpendingInsights;
