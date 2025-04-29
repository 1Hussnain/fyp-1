
import React from "react";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

interface BudgetLimitProps {
  budgetLimit: number;
  onBudgetLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BudgetLimit: React.FC<BudgetLimitProps> = ({ 
  budgetLimit, 
  onBudgetLimitChange 
}) => {
  // Simple validation for budget limit
  const isInvalid = budgetLimit <= 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <label htmlFor="budgetLimit" className="text-sm font-medium">
          Monthly Budget Limit:
        </label>
        <div className="relative w-full md:w-auto">
          <Input
            id="budgetLimit"
            type="number"
            min="0"
            step="1000"
            value={budgetLimit}
            onChange={onBudgetLimitChange}
            className={`max-w-xs ${isInvalid ? 'border-red-300' : ''}`}
          />
          {isInvalid && (
            <div className="text-xs text-red-500 absolute mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Budget must be greater than 0</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetLimit;
