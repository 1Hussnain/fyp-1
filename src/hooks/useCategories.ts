
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { categoryService } from '@/services/supabase';
import { Category, CategoryInsert } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

export const useCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch only user & system categories, already enforced at DB level by RLS
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

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const result = await categoryService.update(id, updates);

    if (result.success) {
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update category",
        variant: "destructive",
      });
    }

    return result;
  };

  const deleteCategory = async (id: string) => {
    const result = await categoryService.delete(id);

    if (result.success) {
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

    // Set up real-time subscription for categories
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          console.log('Categories changed, refetching...');
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};
