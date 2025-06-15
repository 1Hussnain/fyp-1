
/**
 * User Preferences Hook
 * 
 * Custom React hook for managing user preferences including:
 * - Loading user preferences from the database
 * - Updating preferences with optimistic updates
 * - Handling loading and error states
 * - Providing toast notifications for user feedback
 */

import { useState, useEffect } from 'react';
import { preferencesService, Preferences } from '@/services/supabase';
import { toast } from '@/components/ui/sonner';

export const useUserPreferences = () => {
  // State for storing user preferences data
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  
  // Loading state for initial preference fetch
  const [loading, setLoading] = useState(true);
  
  // Loading state for save operations
  const [saving, setSaving] = useState(false);

  // Load preferences on component mount
  useEffect(() => {
    loadPreferences();
  }, []);

  /**
   * Loads user preferences from the database
   * Handles the "no rows" error gracefully by ignoring it
   */
  const loadPreferences = async () => {
    try {
      setLoading(true);
      const { data, error } = await preferencesService.get();
      
      // Ignore "no rows" error (PGRST116) as it's expected for new users
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        toast.error('Failed to load preferences');
      } else {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates user preferences in the database
   * @param newPreferences - Partial preferences object to update
   * @returns Object with success status and data/error
   */
  const updatePreferences = async (newPreferences: Partial<Preferences>) => {
    try {
      setSaving(true);
      const { data, error } = await preferencesService.save(newPreferences);
      
      if (error) {
        toast.error('Failed to save preferences');
        return { success: false, error };
      }

      // Update local state with saved preferences
      setPreferences(data);
      toast.success('Preferences saved successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
      return { success: false, error };
    } finally {
      setSaving(false);
    }
  };

  return {
    preferences,
    loading,
    saving,
    updatePreferences,
    refreshPreferences: loadPreferences,
  };
};
