
import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, DollarSign } from "lucide-react";
import { Category } from "@/types/database";

interface OptimizedCategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => Promise<void>;
  onBudgetChange: (category: Category, value: string) => Promise<void>;
}

const OptimizedCategoryItem = memo(({
  category,
  onEdit,
  onDelete,
  onBudgetChange
}: OptimizedCategoryItemProps) => {
  const handleEdit = useCallback(() => {
    onEdit(category);
  }, [category, onEdit]);

  const handleDelete = useCallback(async () => {
    await onDelete(category);
  }, [category, onDelete]);

  const handleBudgetChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    await onBudgetChange(category, e.target.value);
  }, [category, onBudgetChange]);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: category.color }}
            />
            <div>
              <span className="font-medium">{category.name}</span>
              <Badge variant="outline" className="ml-2 text-xs">
                {category.type}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <Input
                type="number"
                placeholder="Budget"
                value={category.budget || ''}
                onChange={handleBudgetChange}
                className="w-24 h-8 text-sm"
              />
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedCategoryItem.displayName = "OptimizedCategoryItem";

export default OptimizedCategoryItem;
