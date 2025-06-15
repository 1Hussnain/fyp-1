import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  // Define your deployed app's URL for password reset redirection
  const DEPLOYED_URL = "https://your-production-url.com/update-password"; // CHANGE TO YOUR DEPLOYED DOMAIN!

  // Remove sendOTP custom logic, use built-in reset
  const sendOTP = async (userEmail: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: DEPLOYED_URL, // <-- This now points to your production update-password page
      });

      if (error) throw error;

      setEmail(userEmail);
      setOtpSent(true);
      toast({
        title: "Reset Link Sent",
        description: "Please check your email for the password reset link.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove custom OTP verification/reset logic; not needed for Supabase native reset
  const verifyOTPAndResetPassword = async (_otpCode: string, _newPassword: string) => {
    toast({
      title: "Not supported",
      description: "Please use the reset link sent to your email to change your password.",
      variant: "destructive",
    });
    return { success: false, error: "Native reset does not require code verification." };
  };

  const resetState = () => {
    setOtpSent(false);
    setEmail('');
    setLoading(false);
  };

  return {
    loading,
    otpSent,
    email,
    sendOTP,
    verifyOTPAndResetPassword,
    resetState
  };
};
