
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFinancialInsights, FinancialInsight } from "@/hooks/useFinancialInsights";
import { FormattedTransaction } from "@/services/transactionService";

interface FinancialInsightsCardProps {
  transactions: FormattedTransaction[];
  budgetLimit: number;
}

const FinancialInsightsCard: React.FC<FinancialInsightsCardProps> = ({
  transactions,
  budgetLimit
}) => {
  const { insights } = useFinancialInsights(transactions, budgetLimit);

  const getTrendIcon = (trend: FinancialInsight['trend']) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (trend: FinancialInsight['trend'], type: FinancialInsight['type']) => {
    if (type === 'savings_rate') {
      return trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
    }
    return trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500';
  };

  const getBadgeVariant = (trend: FinancialInsight['trend'], type: FinancialInsight['type']) => {
    if (type === 'savings_rate') {
      return trend === 'up' ? 'default' : 'destructive';
    }
    return trend === 'up' ? 'destructive' : 'default';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Add more transactions to see insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const TrendIcon = getTrendIcon(insight.trend);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge variant={getBadgeVariant(insight.trend, insight.type)} className="text-xs">
                          <TrendIcon className="h-3 w-3 mr-1" />
                          {insight.trend}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{insight.description}</p>
                    </div>
                    <div className={`text-lg font-bold ${getTrendColor(insight.trend, insight.type)}`}>
                      {insight.type === 'savings_rate' || insight.type === 'budget_efficiency' || insight.type === 'spending_pattern'
                        ? `${insight.value.toFixed(1)}%`
                        : insight.value.toFixed(1)
                      }
                    </div>
                  </div>
                  {insight.recommendation && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                      💡 {insight.recommendation}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialInsightsCard;
