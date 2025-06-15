
import { supabase } from '@/integrations/supabase/client';

export interface ChatHistory {
  id: string;
  user_id: string;
  sender: string;
  message: string;
  metadata?: any;
  created_at: string;
}

export const chatService = {
  async getHistory(): Promise<{ data: ChatHistory[] | null; error: any }> {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: true });
    
    return { data, error };
  },

  async saveMessage(sender: string, message: string, metadata?: any): Promise<{ data: ChatHistory | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        sender,
        message,
        metadata
      })
      .select()
      .single();
    
    return { data, error };
  }
};
