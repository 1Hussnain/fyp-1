
import React from 'react';
import { motion } from 'framer-motion';
import EnhancedSummaryCards from './EnhancedSummaryCards';
import EnhancedGoalsOverview from './EnhancedGoalsOverview';
import RecentTransactions from './RecentTransactions';
import QuickActions from './QuickActions';
import EnhancedBudgetAlerts from './EnhancedBudgetAlerts';
import EnhancedReceiptUpload from './EnhancedReceiptUpload';
import { useAuth } from '@/contexts/AuthContext';

const DashboardOverview = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user.email?.split('@')[0] || 'User'}!
        </h1>
        <p className="text-blue-100">
          Here's your financial overview for today.
        </p>
      </div>

      {/* Summary Cards */}
      <EnhancedSummaryCards />
      
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EnhancedGoalsOverview />
          <RecentTransactions />
        </div>
        
        <div className="space-y-6">
          <QuickActions />
          <EnhancedBudgetAlerts />
          <EnhancedReceiptUpload />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
