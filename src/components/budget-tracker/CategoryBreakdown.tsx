
import React from "react";

interface CategoryItem {
  name: string;
  amount: number;
}

interface CategoryBreakdownProps {
  categoryTotalsArray: CategoryItem[];
  expenses: number;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categoryTotalsArray, expenses }) => {
  if (categoryTotalsArray.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
      <div className="space-y-3">
        {categoryTotalsArray.map(({ name, amount }) => (
          <div key={name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{name}</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min(100, (amount / expenses) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
