
import { useState, useEffect } from 'react';
import { chatService, ChatHistory } from '@/services/supabase';
import { toast } from '@/components/ui/sonner';

export const useChatWithDatabase = () => {
  const [messages, setMessages] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

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

  const sendMessage = async (message: string, metadata?: any) => {
    try {
      // Save user message
      const { data: userMessage, error: userError } = await chatService.saveMessage('user', message, metadata);
      if (userError) throw userError;

      // Add user message to state immediately
      if (userMessage) {
        setMessages(prev => [...prev, userMessage]);
      }

      // TODO: Here you would integrate with your AI service
      // For now, we'll just save a placeholder AI response
      const aiResponse = "I'm an AI finance advisor. How can I help you today?";
      
      const { data: aiMessage, error: aiError } = await chatService.saveMessage('ai', aiResponse);
      if (aiError) throw aiError;

      // Add AI message to state
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
