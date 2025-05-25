
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, Target, FileText, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "../components/LoginForm";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

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
          <h3 className="text-sm font-medium text-gray-700 mb-3">App Features:</h3>
          <div className="grid grid-cols-2 gap-3">
            <FeatureItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <FeatureItem icon={<Wallet size={18} />} label="Budget Tracker" />
            <FeatureItem icon={<Target size={18} />} label="Goals Tracker" />
            <FeatureItem icon={<FileText size={18} />} label="Budget Summary" />
            <FeatureItem icon={<MessageSquare size={18} />} label="Finance Chat" />
            <FeatureItem icon={<Wallet size={18} />} label="Income & Expenses" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Feature item component for display only
const FeatureItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2 p-2 rounded-md text-sm font-medium text-gray-700 bg-gray-50">
    <span className="text-blue-600">{icon}</span>
    <span>{label}</span>
  </div>
);

export default Index;
