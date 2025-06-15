
import { supabase } from '@/integrations/supabase/client';

export interface Preferences {
  id: string;
  user_id: string;
  theme: string;
  language: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const preferencesService = {
  async get(): Promise<{ data: Preferences | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    return { data, error };
  },

  async save(preferences: Partial<Preferences>): Promise<{ data: Preferences | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

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
