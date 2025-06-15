
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { categoryService } from '@/services/supabase';
import { Category, CategoryInsert } from '@/types/database';

export const useCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const result = await categoryService.getAll();
    
    if (result.success) {
      setCategories(result.data || []);
    } else {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const addCategory = async (categoryData: CategoryInsert) => {
    const result = await categoryService.create(categoryData);

    if (result.success) {
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add category",
        variant: "destructive",
      });
    }

    return result;
  };

  const deleteCategory = async (id: string) => {
    const result = await categoryService.delete(id);

    if (result.success) {
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete category",
        variant: "destructive",
      });
    }

    return result;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    addCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};
