
/**
 * Chat Service Module
 * 
 * Provides database operations for chat functionality including:
 * - Retrieving chat history for authenticated users
 * - Saving new chat messages (both user and AI responses)
 * - Managing message metadata and timestamps
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Interface for chat history records from database
 */
export interface ChatHistory {
  id: string;
  user_id: string;
  sender: string; // 'user' or 'ai'
  message: string;
  metadata?: any; // Optional metadata for message context
  created_at: string;
}

/**
 * Chat service object containing all chat-related database operations
 */
export const chatService = {
  /**
   * Retrieves all chat history for the current authenticated user
   * @returns Promise with chat history data ordered by creation time
   */
  async getHistory(): Promise<{ data: ChatHistory[] | null; error: any }> {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: true });
    
    return { data, error };
  },

  /**
   * Saves a new message to the chat history
   * @param sender - Who sent the message ('user' or 'ai')
   * @param message - The message content
   * @param metadata - Optional metadata to store with the message
   * @returns Promise with the saved message data
   */
  async saveMessage(sender: string, message: string, metadata?: any): Promise<{ data: ChatHistory | null; error: any }> {
    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    // Insert new message into database
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
