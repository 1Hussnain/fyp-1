import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import GoogleButton from "./GoogleButton";
import PasswordResetForm from "./PasswordResetForm";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  
  const toggleView = () => {
    setIsLogin(!isLogin);
    setConfirmationSent(false);
    setShowPasswordReset(false);
    // Clear form when switching
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    setShowPasswordReset(true);
  };

  const handleBackFromPasswordReset = () => {
    setShowPasswordReset(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isLogin && (!firstName || !lastName)) {
      toast.error("Please fill in your first and last name");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else if (data.user) {
          toast.success("Login successful!");
          navigate("/dashboard");
        }
      } else {
        const { data, error, needsConfirmation, message } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`
        });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error("An account with this email already exists. Please sign in instead.");
          } else if (error.message.includes('Password should be at least')) {
            toast.error("Password should be at least 6 characters long.");
          } else {
            toast.error(error.message);
          }
        } else if (needsConfirmation) {
          setConfirmationSent(true);
          toast.success(message || "Please check your email for verification.");
        } else {
          toast.success("Account created successfully!");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (showPasswordReset) {
    return <PasswordResetForm onBack={handleBackFromPasswordReset} />;
  }

  if (confirmationSent) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-semibold text-gray-900">Check Your Email</h2>
        <div className="space-y-3">
          <p className="text-gray-600">
            We've sent a confirmation link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Click the link in your email to activate your account, then come back here to sign in.
          </p>
        </div>
        <div className="pt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setConfirmationSent(false);
              setIsLogin(true);
            }}
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="First Name" 
                type="text" 
                required={!isLogin}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-label="First name"
                disabled={loading}
              />
              <Input 
                placeholder="Last Name" 
                type="text" 
                required={!isLogin}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                aria-label="Last name"
                disabled={loading}
              />
            </div>
          )}
          
          <div className="relative">
            <Input 
              placeholder="Email" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              className="pr-4"
              disabled={loading}
            />
          </div>
          
          <div className="relative">
            <Input 
              placeholder="Password" 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              className="pr-10"
              disabled={loading}
              minLength={6}
            />
            <button 
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>
        
        {isLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> If you just signed up, please check your email and click the confirmation link before trying to sign in.
            </p>
          </div>
        )}
        
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>
        </motion.div>
        
        <div className="relative my-4 flex items-center justify-center">
          <hr className="w-full border-gray-300" />
          <span className="absolute bg-white px-2 text-xs text-gray-500">OR</span>
        </div>
        
        <GoogleButton />
        
        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              toggleView();
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </a>
        </p>
        
        {isLogin && (
          <p className="text-xs text-center text-gray-500">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleForgotPassword();
              }}
              className="hover:text-blue-600"
            >
              Forgot password?
            </a>
          </p>
        )}
      </form>
    </>
  );
};

export default LoginForm;
