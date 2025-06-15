
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
import { Plus } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/database";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

const CategoryManagementDialog = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch
  } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    color: "#3B82F6",
    budget: ""
  });

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    const categoryData = {
      name: formData.name.trim(),
      type: formData.type,
      color: formData.color,
      budget: formData.budget ? parseFloat(formData.budget) : null
    };

    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData);
    } else {
      await addCategory(categoryData as any);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "expense" as "income" | "expense",
      color: "#3B82F6",
      budget: ""
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type as "income" | "expense",
      color: category.color,
      budget: category.budget?.toString() || ""
    });
  };

  const handleDelete = async (category: Category) => {
    await deleteCategory(category.id);
  };

  const handleBudgetChange = async (category: Category, value: string) => {
    await updateCategory(category.id, { budget: value ? parseFloat(value) : null });
  };

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
          <CategoryForm
            formData={formData}
            setFormData={setFormData}
            editingCategory={editingCategory}
            onSave={handleSave}
            onCancel={resetForm}
          />
          
          <CategoryList
            categories={categories}
            onRefresh={refetch}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBudgetChange={handleBudgetChange}
          />
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
