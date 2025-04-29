
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  remaining: number;
  overBudget: boolean;
  closeToLimit: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  income,
  expenses,
  remaining,
  overBudget,
  closeToLimit
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-green-100 shadow border-0">
        <CardContent className="p-4 text-center">
          <p className="text-sm font-medium text-green-800">Monthly Income</p>
          <p className="text-2xl font-bold text-green-700">${income.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-red-100 shadow border-0">
        <CardContent className="p-4 text-center">
          <p className="text-sm font-medium text-red-800">Monthly Expenses</p>
          <p className="text-2xl font-bold text-red-700">${expenses.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-100 shadow border-0">
        <CardContent className="p-4 text-center">
          <p className="text-sm font-medium text-blue-800">Remaining Budget</p>
          <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-700' : 'text-blue-700'}`}>
            ${remaining.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      
      <Card className={`${overBudget ? 'bg-red-100' : closeToLimit ? 'bg-yellow-100' : 'bg-gray-100'} shadow border-0`}>
        <CardContent className="p-4 text-center">
          <p className="text-sm font-medium text-gray-800">Budget Status</p>
          <p className={`text-sm font-bold ${overBudget ? 'text-red-700' : closeToLimit ? 'text-yellow-700' : 'text-gray-700'}`}>
            {overBudget ? (
              <><AlertTriangle className="inline-block h-4 w-4 mr-1" /> Over budget!</>
            ) : closeToLimit ? (
              <><AlertTriangle className="inline-block h-4 w-4 mr-1" /> Near limit!</>
            ) : (
              "Within budget"
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
