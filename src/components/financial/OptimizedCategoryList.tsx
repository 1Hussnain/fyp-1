
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Category } from "@/types/database";
import OptimizedCategoryItem from "./OptimizedCategoryItem";

interface OptimizedCategoryListProps {
  categories: Category[];
  onRefresh: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => Promise<void>;
  onBudgetChange: (category: Category, value: string) => Promise<void>;
}

const OptimizedCategoryList = memo(({
  categories,
  onRefresh,
  onEdit,
  onDelete,
  onBudgetChange
}: OptimizedCategoryListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Existing Categories</h4>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      <div className="grid gap-2 max-h-60 overflow-y-auto">
        {categories.map((category) => (
          <OptimizedCategoryItem
            key={category.id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            onBudgetChange={onBudgetChange}
          />
        ))}
      </div>
    </div>
  );
});

OptimizedCategoryList.displayName = "OptimizedCategoryList";

export default OptimizedCategoryList;
