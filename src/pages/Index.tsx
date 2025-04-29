
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        className="w-full max-w-md shadow-xl rounded-2xl p-8 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginForm />
        {/* Links for demo purposes */}
        <div className="text-center mt-4 space-y-2">
          <Link to="/dashboard" className="block text-blue-600 hover:text-blue-800 text-sm">
            Go to Dashboard (Demo)
          </Link>
          <Link to="/income-expenses" className="block text-blue-600 hover:text-blue-800 text-sm">
            Income & Expenses (Demo)
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
