
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface SpendingCategory {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  budget?: number;
  icon?: string;
  isDefault: boolean;
}

export const useCategoryManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<SpendingCategory[]>([]);

  // Default categories
  const defaultCategories: SpendingCategory[] = [
    { id: '1', name: 'Groceries', type: 'expense', color: '#22c55e', isDefault: true },
    { id: '2', name: 'Transportation', type: 'expense', color: '#3b82f6', isDefault: true },
    { id: '3', name: 'Entertainment', type: 'expense', color: '#a855f7', isDefault: true },
    { id: '4', name: 'Utilities', type: 'expense', color: '#f59e0b', isDefault: true },
    { id: '5', name: 'Healthcare', type: 'expense', color: '#ef4444', isDefault: true },
    { id: '6', name: 'Salary', type: 'income', color: '#10b981', isDefault: true },
    { id: '7', name: 'Freelance', type: 'income', color: '#06b6d4', isDefault: true },
    { id: '8', name: 'Investment', type: 'income', color: '#8b5cf6', isDefault: true },
  ];

  // Load categories from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('spendingCategories');
    if (stored) {
      setCategories(JSON.parse(stored));
    } else {
      setCategories(defaultCategories);
    }
  }, []);

  // Save to localStorage when categories change
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('spendingCategories', JSON.stringify(categories));
    }
  }, [categories]);

  const addCategory = (category: Omit<SpendingCategory, 'id' | 'isDefault'>) => {
    const newCategory: SpendingCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
      isDefault: false
    };

    setCategories(prev => [...prev, newCategory]);
    
    toast({
      title: "Category Added",
      description: `${category.name} category has been created.`,
    });

    return newCategory.id;
  };

  const updateCategory = (id: string, updates: Partial<SpendingCategory>) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === id ? { ...category, ...updates } : category
      )
    );

    toast({
      title: "Category Updated",
      description: "Category has been successfully updated.",
    });
  };

  const deleteCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    
    if (category?.isDefault) {
      toast({
        title: "Cannot Delete",
        description: "Default categories cannot be deleted.",
        variant: "destructive",
      });
      return false;
    }

    setCategories(prev => prev.filter(category => category.id !== id));
    
    toast({
      title: "Category Deleted",
      description: "Category has been removed.",
    });

    return true;
  };

  const getCategoriesByType = (type: "income" | "expense") => {
    return categories.filter(category => category.type === type);
  };

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  const resetToDefaults = () => {
    setCategories(defaultCategories);
    toast({
      title: "Categories Reset",
      description: "All categories have been reset to defaults.",
    });
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    getCategoryById,
    resetToDefaults
  };
};
