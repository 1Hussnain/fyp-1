
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LayoutDashboard, Wallet, Target, FileText, MessageSquare, Settings } from "lucide-react";
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
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Access:</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <QuickLink to="/budget-tracker" icon={<Wallet size={18} />} label="Budget Tracker" />
            <QuickLink to="/goals-tracker" icon={<Target size={18} />} label="Goals Tracker" />
            <QuickLink to="/budget-summary" icon={<FileText size={18} />} label="Budget Summary" />
            <QuickLink to="/finance-chat" icon={<MessageSquare size={18} />} label="Finance Chat" />
            <QuickLink to="/income-expenses" icon={<Wallet size={18} />} label="Income & Expenses" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Quick link component for navigation
const QuickLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <Link 
    to={to} 
    className="flex items-center gap-2 p-2 rounded-md text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
  >
    <span className="text-blue-600">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default Index;
