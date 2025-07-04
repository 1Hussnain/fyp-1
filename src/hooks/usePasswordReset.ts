
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  // For local development, use the localhost URL for password reset
  const RESET_URL = "http://localhost:3000/update-password";

  const sendResetEmail = async (userEmail: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: RESET_URL,
      });
      if (error) throw error;
      setEmail(userEmail);
      toast({
        title: "Reset Link Sent",
        description: "Check your email for the password reset link.",
      });
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not send reset email.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setEmail('');
    setLoading(false);
  };

  return {
    loading,
    email,
    sendResetEmail,
    resetState,
  };
};
