
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import GoogleButton from "./GoogleButton";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${isLogin ? "Login" : "Sign up"} successful`);
    navigate("/dashboard");
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <div className="relative">
            <Input 
              placeholder="Email" 
              type="email" 
              required
              aria-label="Email address"
              className="pr-4"
            />
          </div>
          
          <div className="relative">
            <Input 
              placeholder="Password" 
              type={showPassword ? "text" : "password"} 
              required
              aria-label="Password"
              className="pr-10"
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
        
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            type="submit"
          >
            {isLogin ? "Login" : "Sign Up"}
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
            {isLogin ? "Sign up" : "Log in"}
          </a>
        </p>
        
        {isLogin && (
          <p className="text-xs text-center text-gray-500">
            <a href="#" className="hover:text-blue-600">Forgot password?</a>
          </p>
        )}
      </form>
    </>
  );
};

export default LoginForm;
