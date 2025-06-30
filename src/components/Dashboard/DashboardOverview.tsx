
import React from 'react';
import { motion } from 'framer-motion';
import EnhancedSummaryCards from './EnhancedSummaryCards';
import EnhancedGoalsOverview from './EnhancedGoalsOverview';
import RecentTransactions from './RecentTransactions';
import QuickActions from './QuickActions';
import EnhancedBudgetAlerts from './EnhancedBudgetAlerts';
import EnhancedReceiptUpload from './EnhancedReceiptUpload';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, User } from 'lucide-react';

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

  const getUserName = () => {
    const firstName = user.user_metadata?.first_name;
    if (firstName) return firstName;
    return user.email?.split('@')[0] || 'User';
  };

  // Simple admin check
  const isAdmin = user.email?.includes('admin') || user.user_metadata?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Enhanced Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-white p-6 rounded-lg shadow-lg ${
          isAdmin 
            ? 'bg-gradient-to-r from-red-600 to-pink-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          {isAdmin ? (
            <Shield className="h-6 w-6" />
          ) : (
            <User className="h-6 w-6" />
          )}
          <h1 className="text-2xl font-bold">
            Welcome back, {getUserName()}!
          </h1>
        </div>
        <p className={isAdmin ? 'text-red-100' : 'text-blue-100'}>
          {isAdmin 
            ? 'You have administrative access. Monitor system performance and manage users.'
            : 'Here\'s your financial overview for today.'
          }
        </p>
        {isAdmin && (
          <div className="mt-3 text-sm text-red-100">
            💡 Switch to Admin Mode using the toggle above to access management features.
          </div>
        )}
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <EnhancedSummaryCards />
      </motion.div>
      
      {/* Main Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          <EnhancedGoalsOverview />
          <RecentTransactions />
        </div>
        
        <div className="space-y-6">
          <QuickActions />
          <EnhancedBudgetAlerts />
          <EnhancedReceiptUpload />
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
