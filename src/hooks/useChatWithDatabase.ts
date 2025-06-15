
/**
 * Chat with Database Hook
 * 
 * Custom React hook for managing chat functionality with database persistence:
 * - Loading chat history from database
 * - Sending messages and saving to database
 * - Managing chat state and loading indicators
 * - Handling both user and AI messages
 */

import { useState, useEffect } from 'react';
import { chatService, ChatHistory } from '@/services/supabase';
import { toast } from '@/components/ui/sonner';

export const useChatWithDatabase = () => {
  // Array of chat messages from database
  const [messages, setMessages] = useState<ChatHistory[]>([]);
  
  // Loading state for initial chat history fetch
  const [loading, setLoading] = useState(true);

  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, []);

  /**
   * Loads all chat history for the current user from database
   * Orders messages by creation time (oldest first)
   */
  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await chatService.getHistory();
      if (error) {
        console.error('Error loading chat history:', error);
        toast.error('Failed to load chat history');
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sends a new message and saves both user and AI response to database
   * @param message - The user's message text
   * @param metadata - Optional metadata to attach to the message
   * @returns Success status of the operation
   */
  const sendMessage = async (message: string, metadata?: any) => {
    try {
      // Save user message to database first
      const { data: userMessage, error: userError } = await chatService.saveMessage('user', message, metadata);
      if (userError) throw userError;

      // Add user message to local state immediately for better UX
      if (userMessage) {
        setMessages(prev => [...prev, userMessage]);
      }

      // TODO: Integrate with actual AI service
      // Currently using placeholder response
      const aiResponse = "I'm an AI finance advisor. How can I help you today?";
      
      // Save AI response to database
      const { data: aiMessage, error: aiError } = await chatService.saveMessage('ai', aiResponse);
      if (aiError) throw aiError;

      // Add AI message to local state
      if (aiMessage) {
        setMessages(prev => [...prev, aiMessage]);
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return { success: false, error };
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    refreshHistory: loadChatHistory,
  };
};
