
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CategorySpending } from "@/types/database";

interface OptimizedCategoryChartProps {
  categorySpending: CategorySpending[];
  totalExpenses: number;
}

const OptimizedCategoryChart: React.FC<OptimizedCategoryChartProps> = ({ categorySpending, totalExpenses }) => {

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalExpenses > 0 ? ((data.amount / totalExpenses) * 100).toFixed(1) : "0.0";
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.fill }}
            />
            <span className="font-medium">{data.name}</span>
          </div>
          <p className="text-sm">
            <span className="font-semibold">${data.amount.toFixed(2)}</span>
            <span className="text-gray-500 ml-1">({percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!categorySpending || categorySpending.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No spending data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categorySpending}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
                nameKey="name"
              >
                {categorySpending.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {categorySpending.slice(0, 5).map((item, index) => {
            const percentage = totalExpenses > 0 ? ((item.amount / totalExpenses) * 100).toFixed(1) : "0.0";
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ${item.amount.toFixed(2)} ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedCategoryChart;
