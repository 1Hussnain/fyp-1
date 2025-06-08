
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { usePasswordReset } from '@/hooks/usePasswordReset';

interface PasswordResetFormProps {
  onBack: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onBack }) => {
  const [email, setEmailInput] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    loading,
    otpSent,
    sendOTP,
    verifyOTPAndResetPassword,
    resetState
  } = usePasswordReset();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    await sendOTP(email);
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || !newPassword || !confirmPassword) return;
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    const result = await verifyOTPAndResetPassword(otpCode, newPassword);
    if (result.success) {
      onBack(); // Go back to login form
    }
  };

  const handleBack = () => {
    resetState();
    onBack();
  };

  if (!otpSent) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">Reset Password</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Enter your email address and we'll send you a 4-digit verification code.
        </p>

        <form onSubmit={handleSendOTP} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            disabled={loading}
          />

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </motion.div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Enter Verification Code</h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Enter the 4-digit code sent to your email and create a new password.
      </p>

      <form onSubmit={handleVerifyAndReset} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Verification Code</label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={otpCode}
              onChange={(value) => setOtpCode(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm New Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !otpCode || !newPassword || !confirmPassword}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default PasswordResetForm;
