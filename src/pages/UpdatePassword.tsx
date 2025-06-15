
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"verifying" | "form" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    // If the URL doesn't have a recovery token, fail immediately.
    if (!window.location.hash.includes("type=recovery")) {
      setStage("error");
      setErrorMsg("Invalid or missing password reset link. Please use the link from your email.");
      return;
    }

    // This timer handles cases where the link is invalid and Supabase never sends a SIGNED_IN event.
    const timer = setTimeout(() => {
      setStage((currentStage) => {
        if (currentStage === "verifying") {
          setErrorMsg("The password reset link has expired or is invalid. Please request a new one.");
          return "error";
        }
        return currentStage;
      });
    }, 5000); // 5-second timeout

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // This is the success case. The token was valid and a session is now active.
      if (event === "SIGNED_IN" && session) {
        clearTimeout(timer); // We don't need the fallback timer anymore.
        setStage("form");
        subscription.unsubscribe(); // Unsubscribe to avoid memory leaks.
      }
    });

    return () => {
      subscription?.unsubscribe();
      clearTimeout(timer);
    };
  }, []); // Run only once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // updateUser will work because we have the session from the magic recovery link
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setStage("error");
        setErrorMsg(error.message || "Something went wrong. Please try again.");
      } else {
        setStage("success");
        toast.success("Password updated! You can now log in.");
        await supabase.auth.signOut(); // Sign out to force a fresh login
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      }
    } catch (err: any) {
      setStage("error");
      setErrorMsg(err.message || "Error updating password.");
    } finally {
      setLoading(false);
    }
  };

  if (stage === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Verifying Reset Link...</h2>
        <p className="text-gray-600">Please wait a moment.</p>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <CheckCircle size={48} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Password Updated</h2>
        <p className="text-gray-600 mb-6">You can now login with your new password.</p>
        <Button onClick={() => navigate("/login")} className="px-6">Back to Login</Button>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Password Reset Error</h2>
        <p className="text-gray-600 mb-6">{errorMsg}</p>
        <Button variant="outline" onClick={() => navigate("/login")}>Back to Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto rounded-xl bg-white shadow-lg p-8 mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          type="password"
          autoComplete="new-password"
          placeholder="New password"
          minLength={6}
          value={password}
          disabled={loading}
          onChange={e => setPassword(e.target.value)}
        />
        <Input
          type="password"
          autoComplete="new-password"
          placeholder="Confirm new password"
          minLength={6}
          value={confirm}
          disabled={loading}
          onChange={e => setConfirm(e.target.value)}
        />
        <Button
          className="w-full"
          disabled={loading}
          type="submit"
        >
          {loading ? <><Loader2 className="animate-spin mr-2" />Updating...</> : "Update Password"}
        </Button>
      </form>
      <p className="text-xs text-gray-400 mt-3 text-center">Password must be at least 6 characters.</p>
    </div>
  );
};

export default UpdatePassword;
