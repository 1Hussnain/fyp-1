
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { categoryService } from '@/services/supabase';
import { Category, CategoryInsert } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCategories = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('[useCategories] Fetching categories');
      
      const result = await categoryService.getAll();
      
      if (result.success) {
        setCategories(result.data || []);
        console.log('[useCategories] Successfully loaded', result.data?.length || 0, 'categories');
      } else {
        console.error('[useCategories] Failed to load categories:', result.error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('[useCategories] Error fetching categories:', err);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData: CategoryInsert) => {
    try {
      console.log('[useCategories] Adding new category:', categoryData.name);
      
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
    } catch (err) {
      console.error('[useCategories] Error adding category:', err);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
      return { success: false, error: 'Failed to add category' };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      console.log('[useCategories] Updating category:', id);
      
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
    } catch (err) {
      console.error('[useCategories] Error updating category:', err);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
      return { success: false, error: 'Failed to update category' };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      console.log('[useCategories] Deleting category:', id);
      
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
    } catch (err) {
      console.error('[useCategories] Error deleting category:', err);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
      return { success: false, error: 'Failed to delete category' };
    }
  };

  const handleCategoryUpdate = (payload: any) => {
    console.log('[useCategories] Real-time update:', payload.eventType, payload.new?.name);
    
    if (payload.eventType === "INSERT" && payload.new) {
      setCategories(prev => {
        const exists = prev.some(cat => cat.id === payload.new.id);
        if (exists) return prev;
        return [payload.new, ...prev];
      });
    } else if (payload.eventType === "UPDATE" && payload.new) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === payload.new.id ? { ...cat, ...payload.new } : cat
        )
      );
    } else if (payload.eventType === "DELETE" && payload.old) {
      setCategories(prev =>
        prev.filter(cat => cat.id !== payload.old.id)
      );
    }
  };

  useEffect(() => {
    console.log('[useCategories] Initializing categories');
    fetchCategories();
  }, []);

  // Real-time subscription temporarily disabled to fix crashes
  // useEffect(() => {
  //   if (!user) return;
  //   console.log('[useCategories] Real-time disabled');
  // }, [user?.id]);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};
