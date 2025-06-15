
import { useState, useEffect } from 'react';
import { preferencesService, Preferences } from '@/services/supabase';
import { toast } from '@/components/ui/sonner';

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const { data, error } = await preferencesService.get();
      
      if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
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

  const updatePreferences = async (newPreferences: Partial<Preferences>) => {
    try {
      setSaving(true);
      const { data, error } = await preferencesService.save(newPreferences);
      
      if (error) {
        toast.error('Failed to save preferences');
        return { success: false, error };
      }

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
