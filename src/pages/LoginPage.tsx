
import React from "react";
import { motion } from "framer-motion";
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <span className="text-2xl font-bold text-white">F</span>
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              FinanceTracker
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your finances with ease
            </p>
          </div>
          
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
