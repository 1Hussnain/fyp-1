
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
        <div className="text-center mt-6">
          <h3 className="font-medium mb-2">Financial Planning App Demo</h3>
          <div className="grid grid-cols-1 gap-2 mt-4">
            <Link to="/dashboard" className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Dashboard
            </Link>
            <Link to="/income-expenses" className="block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Income & Expenses
            </Link>
            <Link to="/budget-tracker" className="block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Budget Tracker
            </Link>
            <Link to="/goals-tracker" className="block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Goals Tracker
            </Link>
            <Link to="/budget-summary" className="block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
              Budget Summary
            </Link>
            <Link to="/documents" className="block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Document Viewer
            </Link>
            <Link to="/finance-chat" className="block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Finance Chat
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
