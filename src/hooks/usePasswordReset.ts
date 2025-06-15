
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const sendOTP = async (userEmail: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-password-reset-otp', {
        body: { email: userEmail }
      });

      if (error) throw error;

      setEmail(userEmail);
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the 4-digit verification code.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndResetPassword = async (otpCode: string, newPassword: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp-and-reset-password', {
        body: { 
          email,
          otpCode,
          newPassword 
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully. You can now sign in with your new password.",
      });

      // Reset state
      setOtpSent(false);
      setEmail('');

      return { success: true };
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP and reset password",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
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
