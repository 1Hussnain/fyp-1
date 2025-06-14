
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, RotateCcw } from "lucide-react";
import { useCategoryManagement, SpendingCategory } from "@/hooks/useCategoryManagement";

const CategoryManagementDialog = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefaults
  } = useCategoryManagement();

  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SpendingCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    color: "#3B82F6",
    budget: ""
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const categoryData = {
      name: formData.name.trim(),
      type: formData.type,
      color: formData.color,
      budget: formData.budget ? parseFloat(formData.budget) : undefined
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "expense",
      color: "#3B82F6",
      budget: ""
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: SpendingCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      budget: category.budget?.toString() || ""
    });
  };

  const handleDelete = (category: SpendingCategory) => {
    deleteCategory(category.id);
  };

  const colorOptions = [
    "#3B82F6", "#22C55E", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#06B6D4", "#F97316", "#84CC16"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Spending Categories</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Add/Edit Form */}
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
                onClick={handleSave}
                disabled={!formData.name.trim()}
              >
                {editingCategory ? "Update" : "Add"} Category
              </Button>
              {editingCategory && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Existing Categories</h4>
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
            </div>

            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
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
                        {category.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                        {category.budget && (
                          <span className="text-xs text-gray-500">
                            Budget: ${category.budget}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      disabled={category.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManagementDialog;
