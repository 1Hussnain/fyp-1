
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "@/types/database";

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => Promise<void>;
  onBudgetChange: (category: Category, value: string) => Promise<void>;
}

const CategoryItem = ({
  category,
  onEdit,
  onDelete,
  onBudgetChange
}: CategoryItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <div>
          <span className="font-medium">{category.name}</span>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={category.type === 'income' ? 'default' : 'secondary'}>
              {category.type}
            </Badge>
            {category.is_system && (
              <Badge variant="outline" className="text-xs">
                Default
              </Badge>
            )}
            <span className="text-xs text-gray-500 flex items-center gap-1">
              Budget:&nbsp;
              <Input
                type="number"
                min="0"
                step="0.01"
                defaultValue={category.budget ?? ""}
                className="h-6 w-20 px-2 py-0 text-xs"
                onBlur={e => onBudgetChange(category, e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                disabled={category.is_system}
              />
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(category)}
          disabled={category.is_system}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(category)}
          disabled={category.is_system}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CategoryItem;
