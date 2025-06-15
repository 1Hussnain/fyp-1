
/**
 * User Preferences Service Module
 * 
 * Handles database operations for user preferences including:
 * - Retrieving user-specific preferences
 * - Creating and updating preferences with upsert operations
 * - Managing theme, language, and notification settings
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Interface for user preferences stored in database
 */
export interface Preferences {
  id: string;
  user_id: string;
  theme: string; // 'light', 'dark', or 'system'
  language: string; // Language code (e.g., 'en', 'es')
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Preferences service object containing all preference-related database operations
 */
export const preferencesService = {
  /**
   * Retrieves preferences for the current authenticated user
   * @returns Promise with user preferences data or null if not found
   */
  async get(): Promise<{ data: Preferences | null; error: any }> {
    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    // Fetch preferences for this user
    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    return { data, error };
  },

  /**
   * Saves user preferences using upsert (insert or update)
   * @param preferences - Partial preferences object to save
   * @returns Promise with the saved preferences data
   */
  async save(preferences: Partial<Preferences>): Promise<{ data: Preferences | null; error: any }> {
    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    // Upsert preferences (create if doesn't exist, update if exists)
    const { data, error } = await supabase
      .from('preferences')
      .upsert({
        user_id: user.id,
        ...preferences
      })
      .select()
      .single();
    
    return { data, error };
  }
};
