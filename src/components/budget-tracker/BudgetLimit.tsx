
import React from "react";
import { Input } from "@/components/ui/input";

interface BudgetLimitProps {
  budgetLimit: number;
  onBudgetLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BudgetLimit: React.FC<BudgetLimitProps> = ({ 
  budgetLimit, 
  onBudgetLimitChange 
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <label htmlFor="budgetLimit" className="text-sm font-medium">
          Monthly Budget Limit:
        </label>
        <Input
          id="budgetLimit"
          type="number"
          min="0"
          step="1000"
          value={budgetLimit}
          onChange={onBudgetLimitChange}
          className="max-w-xs"
        />
      </div>
    </div>
  );
};

export default BudgetLimit;
