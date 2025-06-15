
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CategoryInsert, Category } from "@/types/database";

interface CategoryFormProps {
  formData: {
    name: string;
    type: "income" | "expense";
    color: string;
    budget: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    type: "income" | "expense";
    color: string;
    budget: string;
  }>>;
  editingCategory: Category | null;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

const CategoryForm = ({
  formData,
  setFormData,
  editingCategory,
  onSave,
  onCancel
}: CategoryFormProps) => {
  const colorOptions = [
    "#3B82F6", "#22C55E", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#06B6D4", "#F97316", "#84CC16"
  ];

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h4 className="font-medium">
        {editingCategory ? "Edit Category" : "Add New Category"}
      </h4>
      
      <div className="grid gap-3">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Groceries, Rent"
          />
        </div>
        <div>
          <Label>Type</Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value: "income" | "expense") => 
              setFormData(prev => ({ ...prev, type: value }))
            }
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="income" id="income" />
              <Label htmlFor="income">Income</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense" id="expense" />
              <Label htmlFor="expense">Expense</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label>Color</Label>
          <div className="flex gap-2 mt-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${
                  formData.color === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setFormData(prev => ({ ...prev, color }))}
              />
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="budget">Monthly Budget (Optional)</Label>
          <Input
            id="budget"
            type="number"
            min="0"
            step="0.01"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onSave}
          disabled={!formData.name.trim()}
        >
          {editingCategory ? "Update" : "Add"} Category
        </Button>
        {editingCategory && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryForm;
