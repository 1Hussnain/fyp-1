
/**
 * Categories Hook
 * 
 * Provides category management functionality with:
 * - CRUD operations for categories
 * - Real-time updates through centralized subscription manager
 * - Error handling with user-friendly toast notifications
 * - Support for both user-created and system categories
 * 
 * Note: Categories are shared between users for system categories,
 * and private for user-created categories (enforced by RLS policies)
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { categoryService } from '@/services/supabase';
import { Category, CategoryInsert } from '@/types/database';
import { useSharedRealtime } from './useSharedRealtime';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Main categories hook providing CRUD operations and real-time updates
 * @returns Object with categories data, loading states, and CRUD functions
 */
export const useCategories = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // State management for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all categories (user + system) - RLS policies handle filtering
   * Categories are automatically filtered by the database to show:
   * - System categories (available to all users)
   * - User's private categories
   */
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

  /**
   * Add a new category with validation and error handling
   * @param categoryData - Category data to create
   * @returns Promise with success status and error details
   */
  const addCategory = async (categoryData: CategoryInsert) => {
    try {
      console.log('[useCategories] Adding new category:', categoryData.name);
      
      const result = await categoryService.create(categoryData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Category added successfully",
        });
        // Real-time subscription will handle the state update automatically
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

  /**
   * Update an existing category
   * @param id - Category ID to update
   * @param updates - Partial category data to update
   * @returns Promise with success status and error details
   */
  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      console.log('[useCategories] Updating category:', id);
      
      const result = await categoryService.update(id, updates);

      if (result.success) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
        // Real-time subscription will handle the state update automatically
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

  /**
   * Delete a category with validation
   * @param id - Category ID to delete
   * @returns Promise with success status and error details
   */
  const deleteCategory = async (id: string) => {
    try {
      console.log('[useCategories] Deleting category:', id);
      
      const result = await categoryService.delete(id);

      if (result.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        // Real-time subscription will handle the state update automatically
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

  /**
   * Handle real-time updates for categories
   * Processes INSERT, UPDATE, and DELETE events from the centralized manager
   */
  const handleCategoryUpdate = (payload: any) => {
    console.log('[useCategories] Real-time update:', payload.eventType, payload.new?.name);
    
    if (payload.eventType === "INSERT" && payload.new) {
      setCategories(prev => {
        // Prevent duplicates
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

  // Initial data fetch on component mount
  useEffect(() => {
    console.log('[useCategories] Initializing categories');
    fetchCategories();
  }, []);

  // Setup real-time subscription using centralized manager
  // This prevents duplicate subscriptions and ensures proper cleanup
  useSharedRealtime('categories', user?.id || null, handleCategoryUpdate);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};
