
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { usePasswordReset } from "@/hooks/usePasswordReset";

interface PasswordResetFormProps {
  onBack: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onBack }) => {
  const [emailInput, setEmailInput] = useState('');
  const [sent, setSent] = useState(false);

  const {
    loading,
    email,
    sendResetEmail,
    resetState,
  } = usePasswordReset();

  const handleBack = () => {
    resetState();
    setSent(false);
    onBack();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    const result = await sendResetEmail(emailInput);
    if (result.success) setSent(true);
  };

  return !sent ? (
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
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={emailInput}
          onChange={e => setEmailInput(e.target.value)}
          required
          disabled={loading}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !emailInput}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  ) : (
    <div className="space-y-5 text-center">
      <h2 className="text-xl font-semibold">Check Your Email</h2>
      <p className="text-gray-600">
        A password reset link has been sent to <strong>{emailInput}</strong>.  
        Follow the link to set a new password.
      </p>
      <Button onClick={handleBack} className="w-full mt-2" variant="outline">
        Back to Login
      </Button>
    </div>
  );
};

export default PasswordResetForm;
